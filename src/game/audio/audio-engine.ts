import Phaser from 'phaser';
import { midiToHz } from './notes';
import { loadMuted, saveMutedLocally } from './mute-pref';
import { eventsBetween, secondsPerBeat, TRACKS, type ScoreEvent, type Track, type TrackId } from './score';
import { recipe, type Layer, type SfxName, type SfxOptions } from './sfx';

/** Mezcla fija (los deslizadores llegarán con el panel de padres). */
const MASTER_GAIN = 0.6;
const MUSIC_GAIN = 0.35;
const SFX_GAIN = 0.8;

/** Planificador de música: cada cuánto despierta y cuánto programa por delante (segundos). */
const TICK_MS = 25;
const LOOKAHEAD = 0.1;
const START_DELAY = 0.05;

const FADE_OUT_S = 0.4;
const FADE_IN_S = 0.3;
const MUTE_RAMP_S = 0.05;
const TAP_MIN_GAP_S = 0.04;

interface Playing {
  track: Track;
  gain: GainNode;
  /** Tiempo del `AudioContext` en el que cae el pulso 0. */
  startTime: number;
  /** Pulso absoluto hasta el que ya se ha programado. */
  scheduledTo: number;
}

/**
 * Motor de audio único para toda la aplicación: música por pantalla con fundidos y efectos
 * sintetizados, sobre el `AudioContext` de Phaser. Sin Web Audio todas las llamadas son no-ops.
 *
 * Grafo: fuente → bus (música | efectos) → master → compresor (limitador) → destino.
 */
class AudioEngine {
  private game: Phaser.Game | undefined;
  private ctx: AudioContext | undefined;
  private master: GainNode | undefined;
  private musicBus: GainNode | undefined;
  private sfxBus: GainNode | undefined;
  private noise: AudioBuffer | undefined;

  private isMuted = loadMuted();
  private started = false;
  /** Pieza que pide la pantalla actual (`null` = ninguna). */
  private wanted: TrackId | null = null;
  private playing: Playing | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;
  private lastTapAt = -Infinity;

  /** Se llama una vez al arrancar (en `BootScene`). */
  init(game: Phaser.Game): void {
    if (this.ctx) return;
    this.game = game;
    game.sound.mute = this.isMuted;
    const manager = game.sound;
    if (!(manager instanceof Phaser.Sound.WebAudioSoundManager)) return;
    const ctx = manager.context;
    if (!ctx) return;
    try {
      this.ctx = ctx;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -10;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.25;
      limiter.connect(ctx.destination);

      this.master = ctx.createGain();
      this.master.gain.value = this.isMuted ? 0 : MASTER_GAIN;
      this.master.connect(limiter);
      this.musicBus = ctx.createGain();
      this.musicBus.gain.value = MUSIC_GAIN;
      this.musicBus.connect(this.master);
      this.sfxBus = ctx.createGain();
      this.sfxBus.gain.value = SFX_GAIN;
      this.sfxBus.connect(this.master);

      this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } catch {
      this.ctx = undefined;
      return;
    }

    // Phaser ya suspende el contexto al perder el foco; esto lo refuerza en iOS al bloquear.
    document.addEventListener('visibilitychange', () => {
      if (!this.ctx || !this.started) return;
      if (document.hidden) void this.ctx.suspend().catch(() => undefined);
      else void this.ctx.resume().catch(() => undefined);
    });
  }

  /** Primer toque del niño: a partir de aquí puede sonar todo. */
  start(): void {
    if (this.started) return;
    this.started = true;
    if (this.ctx?.state === 'suspended') void this.ctx.resume().catch(() => undefined);
    if (this.wanted) this.begin(this.wanted);
  }

  get muted(): boolean {
    return this.isMuted;
  }

  setMuted(muted: boolean): void {
    if (muted === this.isMuted) return;
    this.isMuted = muted;
    saveMutedLocally(muted);
    if (this.game) this.game.sound.mute = muted;
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    const gain = this.master.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(gain.value, now);
    gain.linearRampToValueAtTime(muted ? 0 : MASTER_GAIN, now + MUTE_RAMP_S);
    if (muted) this.fadeOutCurrent(MUTE_RAMP_S);
    else if (this.wanted) this.begin(this.wanted);
  }

  /** Música de la pantalla actual. Si ya suena esa pieza, sigue sin reiniciarse. */
  playMusic(id: TrackId): void {
    this.wanted = id;
    if (this.playing?.track.id === id) return;
    this.begin(id);
  }

  /** Apaga la música en un fundido y deja la pantalla sin pieza. */
  stopMusic(fadeMs = FADE_OUT_S * 1000): void {
    this.wanted = null;
    this.fadeOutCurrent(fadeMs / 1000);
  }

  sfx(name: SfxName, opts?: SfxOptions): void {
    const ctx = this.ctx;
    if (!ctx || !this.sfxBus || !this.started || this.isMuted || ctx.state !== 'running') return;
    const t0 = ctx.currentTime + 0.005;
    if (name === 'tap') {
      if (t0 - this.lastTapAt < TAP_MIN_GAP_S) return;
      this.lastTapAt = t0;
    }
    for (const layer of recipe(name, opts).layers) this.playLayer(layer, t0, this.sfxBus);
  }

  // --- Música ---------------------------------------------------------------------------------

  private begin(id: TrackId): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus || !this.started || this.isMuted) return;
    if (this.playing?.track.id === id) return;
    this.fadeOutCurrent(FADE_OUT_S);
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + FADE_IN_S);
    gain.connect(this.musicBus);
    this.playing = { track: TRACKS[id], gain, startTime: now + START_DELAY, scheduledTo: 0 };
    this.timer ??= setInterval(() => this.tick(), TICK_MS);
    this.tick();
  }

  private fadeOutCurrent(seconds: number): void {
    const old = this.playing;
    this.playing = undefined;
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    if (!old || !this.ctx) return;
    const now = this.ctx.currentTime;
    const g = old.gain.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + seconds);
    setTimeout(() => old.gain.disconnect(), (seconds + LOOKAHEAD + 0.5) * 1000);
  }

  /** Programa los eventos de los próximos `LOOKAHEAD` segundos. */
  private tick(): void {
    const ctx = this.ctx;
    const p = this.playing;
    if (!ctx || !p || ctx.state !== 'running') return;
    const spb = secondsPerBeat(p.track);
    const now = ctx.currentTime;
    // Si se ha quedado atrás (pestaña dormida), se salta hasta ahora en vez de recuperar notas.
    if (now - (p.startTime + p.scheduledTo * spb) > LOOKAHEAD) p.startTime = now + START_DELAY - p.scheduledTo * spb;
    const toBeat = (now + LOOKAHEAD - p.startTime) / spb;
    for (const e of eventsBetween(p.track, p.scheduledTo, toBeat)) this.playNote(e, p.startTime + e.beat * spb, spb, p.gain);
    p.scheduledTo = Math.max(p.scheduledTo, toBeat);
  }

  private playNote(e: ScoreEvent, t: number, spb: number, out: AudioNode): void {
    const ctx = this.ctx!;
    if (e.voice === 'hat') {
      this.playLayer({ kind: 'noise', start: 0, dur: 0.05, attack: 0.002, gain: 0.07, filterHz: 7000, q: 0.8 }, t, out);
      return;
    }
    if (e.voice === 'kick') {
      this.playLayer({ kind: 'tone', wave: 'sine', start: 0, dur: 0.14, attack: 0.003, gain: 0.5, freq: [[0, 130], [0.12, 50]] }, t, out);
      return;
    }
    const lead = e.voice === 'lead';
    const osc = ctx.createOscillator();
    osc.type = lead ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(midiToHz(e.midi!), t);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lead ? 2400 : 900;
    const env = ctx.createGain();
    const peak = lead ? 0.22 : 0.4;
    const end = t + Math.max(0.06, e.dur * spb * 0.9);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(peak, t + 0.012);
    env.gain.setTargetAtTime(peak * 0.55, t + 0.012, 0.09);
    env.gain.setTargetAtTime(0, end, 0.04);
    osc.connect(filter).connect(env).connect(out);
    osc.start(t);
    osc.stop(end + 0.3);
    osc.onended = () => env.disconnect();
  }

  // --- Recetas --------------------------------------------------------------------------------

  private playLayer(layer: Layer, t0: number, out: AudioNode): void {
    const ctx = this.ctx!;
    const s = t0 + layer.start;
    const end = s + layer.dur;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, s);
    env.gain.linearRampToValueAtTime(layer.gain, s + layer.attack);
    env.gain.exponentialRampToValueAtTime(0.0001, end);
    env.connect(out);

    let source: AudioScheduledSourceNode;
    if (layer.kind === 'noise') {
      const src = ctx.createBufferSource();
      src.buffer = this.noise!;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = layer.filterHz;
      filter.Q.value = layer.q ?? 1;
      src.connect(filter).connect(env);
      source = src;
    } else {
      const osc = ctx.createOscillator();
      osc.type = layer.wave;
      if (typeof layer.freq === 'number') {
        osc.frequency.setValueAtTime(layer.freq, s);
      } else {
        layer.freq.forEach(([at, f], i) => {
          if (i === 0) osc.frequency.setValueAtTime(f, s + at);
          else osc.frequency.exponentialRampToValueAtTime(f, s + at);
        });
      }
      if (layer.vibrato) {
        const lfo = ctx.createOscillator();
        lfo.frequency.value = layer.vibrato.rate;
        const depth = ctx.createGain();
        depth.gain.value = layer.vibrato.depth;
        lfo.connect(depth).connect(osc.frequency);
        lfo.start(s);
        lfo.stop(end + 0.02);
      }
      osc.connect(env);
      source = osc;
    }
    source.start(s);
    source.stop(end + 0.02);
    source.onended = () => env.disconnect();
  }
}

export const audio = new AudioEngine();

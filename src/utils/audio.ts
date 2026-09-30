/**
 * Procedural Web Audio API sound engine for Dholavira: City of Clues
 * Generates thematic audio effects, multi-layered ambient soundscapes,
 * wind through stone ruins, distant desert birds, and reactive period-appropriate music.
 * Completely self-contained without external network audio dependencies.
 */

export type CityZone = 'reservoir' | 'citadel' | 'stream_bund' | 'middle_town' | 'desert_outskirts';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Ambient wind layer
  private windNode: AudioBufferSourceNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private windGain: GainNode | null = null;
  private windLFO: OscillatorNode | null = null;

  // Bird calls timer
  private birdTimer: number | null = null;

  // Music generative loop
  private currentZone: CityZone = 'reservoir';
  private musicTimer: number | null = null;
  private musicGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  // Starts ambient layers (Wind, Birds, Generative Period Music)
  public startAmbient() {
    if (this.isMuted || this.isAmbientRunning) return;
    this.initContext();
    if (!this.ctx) return;

    this.isAmbientRunning = true;
    this.startWindLayer();
    this.scheduleDistantBirds();
    this.scheduleMusicPhrases();
  }

  public stopAmbient() {
    this.isAmbientRunning = false;
    if (this.windNode) {
      try {
        this.windNode.stop();
        this.windNode.disconnect();
      } catch {}
      this.windNode = null;
    }
    if (this.windLFO) {
      try {
        this.windLFO.stop();
        this.windLFO.disconnect();
      } catch {}
      this.windLFO = null;
    }
    if (this.birdTimer) {
      window.clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.musicTimer) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Wind howling through stone ruins
  private startWindLayer() {
    if (!this.ctx || !this.masterGain) return;

    // Create 4-second brownian noise buffer for wind base
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.025 * white)) / 1.025;
      lastOut = output[i];
      output[i] *= 3.0;
    }

    this.windNode = this.ctx.createBufferSource();
    this.windNode.buffer = buffer;
    this.windNode.loop = true;

    // Resonant bandpass filter to sound like wind whistling through stone masonry crevices
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(2.8, this.ctx.currentTime);

    // LFO to modulate howling wind speed and whistling resonance
    this.windLFO = this.ctx.createOscillator();
    this.windLFO.type = 'sine';
    this.windLFO.frequency.setValueAtTime(0.18, this.ctx.currentTime); // slow gusts every ~5.5s

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    this.windLFO.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.windNode.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    this.windNode.start();
    this.windLFO.start();
  }

  // Random distant desert birds (Desert kite / falcon / sandgrouse calls)
  private scheduleDistantBirds() {
    if (!this.isAmbientRunning) return;

    const delay = Math.random() * 10000 + 8000; // every 8-18 seconds
    this.birdTimer = window.setTimeout(() => {
      this.playDistantBirdCall();
      this.scheduleDistantBirds();
    }, delay);
  }

  private playDistantBirdCall() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    // Falcon / raptor high cry frequency envelope
    const baseFreq = 2200 + Math.random() * 600;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, t + 0.45);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, t);
    filter.Q.setValueAtTime(4.0, t);

    // Soft distance gain
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.035, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.52);

    // Echo reply 350ms later for distance depth
    if (Math.random() > 0.4) {
      window.setTimeout(() => {
        if (!this.ctx || !this.masterGain) return;
        const echoT = this.ctx.currentTime;
        const echoOsc = this.ctx.createOscillator();
        const echoGain = this.ctx.createGain();

        echoOsc.type = 'sine';
        echoOsc.frequency.setValueAtTime(baseFreq * 0.9, echoT);
        echoOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.65, echoT + 0.35);

        echoGain.gain.setValueAtTime(0.015, echoT);
        echoGain.gain.exponentialRampToValueAtTime(0.0001, echoT + 0.38);

        echoOsc.connect(echoGain);
        echoGain.connect(this.masterGain);

        echoOsc.start(echoT);
        echoOsc.stop(echoT + 0.4);
      }, 320);
    }
  }

  // Reactive location tracking: adjusts wind & music based on player coordinates
  public updatePlayerZone(zone: CityZone) {
    if (this.currentZone === zone) return;
    this.currentZone = zone;

    // Modulate wind howling based on terrain exposure
    if (this.windFilter && this.windGain && this.ctx) {
      const t = this.ctx.currentTime;
      if (zone === 'stream_bund' || zone === 'desert_outskirts') {
        // High open desert wind
        this.windGain.gain.linearRampToValueAtTime(0.12, t + 1.5);
        this.windFilter.frequency.linearRampToValueAtTime(450, t + 1.5);
      } else if (zone === 'reservoir') {
        // Sheltered deep rock-cut basin
        this.windGain.gain.linearRampToValueAtTime(0.05, t + 1.5);
        this.windFilter.frequency.linearRampToValueAtTime(260, t + 1.5);
      } else if (zone === 'citadel') {
        // Elevated acropolis breeze
        this.windGain.gain.linearRampToValueAtTime(0.09, t + 1.5);
        this.windFilter.frequency.linearRampToValueAtTime(360, t + 1.5);
      } else {
        // Town streets
        this.windGain.gain.linearRampToValueAtTime(0.06, t + 1.5);
        this.windFilter.frequency.linearRampToValueAtTime(300, t + 1.5);
      }
    }

    // Trigger immediate melodic phrase transitioning into the new zone
    this.playZoneMusicalMotif(zone);
  }

  // Periodic subtle period-appropriate musical phrases
  private scheduleMusicPhrases() {
    if (!this.isAmbientRunning) return;

    const delay = Math.random() * 4000 + 7000; // phrase every 7-11 seconds
    this.musicTimer = window.setTimeout(() => {
      this.playZoneMusicalMotif(this.currentZone);
      this.scheduleMusicPhrases();
    }, delay);
  }

  // Plays authentic ancient modal phrases tailored to city sector
  public playZoneMusicalMotif(zone: CityZone) {
    if (this.isMuted || !this.ctx || !this.musicGain) return;

    const t = this.ctx.currentTime;

    // 1. RESERVOIR COMPLEX: Shimmering, water-like, peaceful pentatonic notes (Durga/Megh scale)
    if (zone === 'reservoir') {
      const notes = [293.66, 369.99, 440.00, 493.88, 587.33]; // D4, F#4, A4, B4, D5
      const phrase = [notes[0], notes[2], notes[3], notes[4], notes[2]];

      phrase.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const noteTime = t + idx * 0.45;
        this.synthesizeFluteOrBansuriNote(freq, noteTime, 0.9, 0.04);
      });
    }

    // 2. CITADEL (ACROPOLIS): Regal, solemn, deep drone and bronze singing bowl chime
    else if (zone === 'citadel') {
      // Deep fundamental drone (D2, 73.4 Hz + harmonic A2, 110 Hz)
      this.synthesizeBronzeChime(146.83, t, 3.2, 0.07); // D3
      this.synthesizeBronzeChime(220.00, t + 0.3, 2.5, 0.05); // A3

      // Ancient temple bowl shimmer
      window.setTimeout(() => {
        if (!this.ctx || !this.musicGain) return;
        this.synthesizeBronzeChime(440.00, this.ctx.currentTime, 2.8, 0.04);
      }, 700);
    }

    // 3. STREAM BUND: Solitary windswept wooden flute arpeggio
    else if (zone === 'stream_bund') {
      const notes = [220.00, 261.63, 293.66, 349.23, 440.00]; // A3, C4, D4, F4, A4
      const phrase = [notes[2], notes[4], notes[3], notes[0]];

      phrase.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const noteTime = t + idx * 0.55;
        this.synthesizeFluteOrBansuriNote(freq, noteTime, 1.2, 0.035);
      });
    }

    // 4. ARTISAN / MIDDLE TOWN: Plucked veena/harp style melodic notes
    else if (zone === 'middle_town') {
      const notes = [293.66, 329.63, 369.99, 440.00, 493.88]; // D4, E4, F#4, A4, B4
      const phrase = [notes[1], notes[2], notes[4], notes[3]];

      phrase.forEach((freq, idx) => {
        if (!this.ctx || !this.musicGain) return;
        const noteTime = t + idx * 0.32;
        this.synthesizePluckedString(freq, noteTime, 0.8, 0.045);
      });
    }

    // 5. DESERT OUTSKIRTS: Deep earthen tone & wind shimmer
    else {
      this.synthesizeBronzeChime(110.00, t, 3.0, 0.04); // A2
      this.synthesizeFluteOrBansuriNote(329.63, t + 0.8, 1.4, 0.025); // E4
    }
  }

  // Synthesizes a breathy wooden bansuri / bamboo flute tone with subtle vibrato
  private synthesizeFluteOrBansuriNote(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    // Subtle natural vibrato (4.8 Hz LFO)
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(4.8, startTime);
    vibratoGain.gain.setValueAtTime(2.5, startTime);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    // Warm lowpass filter to emulate hollow bamboo breath
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 2.8, startTime);
    filter.Q.setValueAtTime(2.0, startTime);

    // Soft breath attack & long gentle release
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    vibrato.start(startTime);
    osc.start(startTime);

    vibrato.stop(startTime + duration);
    osc.stop(startTime + duration);
  }

  // Synthesizes an ancient bronze singing bowl / temple bell chime with rich harmonics
  private synthesizeBronzeChime(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    // Harmonics for bell: fundamental + inharmonic bell ratios (1, 2.76, 5.4)
    const harmonics = [1.0, 2.76, 5.4];
    harmonics.forEach((mult, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * mult, startTime);

      const partVol = (volume / (idx + 1)) * 0.7;
      gain.gain.setValueAtTime(partVol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration / (idx + 1));

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // Synthesizes an ancient plucked string (veena / arched harp)
  private synthesizePluckedString(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.0, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + 0.2);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // UI Tap / Stone Click
  public playClick() {
    this.startAmbient(); // Initialize ambient on first interaction
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Clue Discovered Chime
  public playClueDiscovered() {
    this.startAmbient();
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const frequencies = [587.33, 880, 1174.66, 1760]; // D chord harmonics
    frequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.12 / (idx + 1), this.ctx.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.04 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + idx * 0.04);
      osc.stop(this.ctx.currentTime + idx * 0.04 + 0.65);
    });
  }

  // Water Flow Simulation Surge
  public playWaterFlow(durationSeconds: number = 3.5) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.5, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSeconds);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    lfo.start();
    noise.start();
    lfo.stop(this.ctx.currentTime + durationSeconds);
    noise.stop(this.ctx.currentTime + durationSeconds);
  }

  // Micro-drilling friction
  public playDrillingSound(durationSeconds: number = 1.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + durationSeconds * 0.5);
    osc.frequency.linearRampToValueAtTime(270, this.ctx.currentTime + durationSeconds);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSeconds);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + durationSeconds);
  }

  // Puzzle success fanfare
  public playSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(this.ctx.currentTime + idx * 0.1);
      osc.stop(this.ctx.currentTime + idx * 0.1 + 0.85);
    });
  }

  // Failure / retry buzzer
  public playFailure() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Footstep audio
  public playFootstep() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90 + Math.random() * 30, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const soundManager = new SoundEngine();

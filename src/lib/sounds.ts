// Web Audio API pure synthesizer soundscapes (Zero external files required)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: string | null = null;
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private isPlaying: boolean = false;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): string | null {
    return this.isPlaying ? this.currentType : null;
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      if (typeof node === "number") {
        clearInterval(node);
      } else {
        try {
          if ("stop" in node && typeof (node as AudioScheduledSourceNode).stop === "function") {
            (node as AudioScheduledSourceNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = null;
  }

  // Pink/Brown noise generator for Rainfall
  public playRain() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for gentle rain drops
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
    this.isPlaying = true;
    this.currentType = "rain";
  }

  // Mountain Breeze / Wind sound generator
  public playWind() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.5; // boost brown noise
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // LFO for swaying wind
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    brownNoise.connect(filter);
    filter.connect(this.gainNode);
    brownNoise.start();

    this.activeNodes.push(brownNoise, filter, lfo, lfoGain);
    this.isPlaying = true;
    this.currentType = "wind";
  }

  // Harmonic Tibetan Singing Bowl Chime (432Hz Healing Frequency)
  public playBowl() {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    const playStrike = () => {
      if (!this.ctx || !this.gainNode) return;
      const baseFreq = 432; // Healing A frequency
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.4, 0.2, 0.08, 0.03];

      harmonics.forEach((mult, index) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const toneGain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * mult, this.ctx.currentTime);

        toneGain.gain.setValueAtTime(0, this.ctx.currentTime);
        toneGain.gain.linearRampToValueAtTime(gains[index], this.ctx.currentTime + 0.1);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 5.5);

        osc.connect(toneGain);
        toneGain.connect(this.gainNode);
        osc.start();
        osc.stop(this.ctx.currentTime + 6.0);
      });
    };

    playStrike();
    const interval = window.setInterval(playStrike, 6500);

    this.activeNodes.push(interval);
    this.isPlaying = true;
    this.currentType = "bowl";
  }

  // Gentle Breath Cue Chime for Guided Meditation
  public playBreathCue(type: "inhale" | "hold" | "exhale") {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const cueGain = this.ctx.createGain();
    const freq = type === "inhale" ? 528 : type === "hold" ? 432 : 396;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    cueGain.gain.setValueAtTime(0, this.ctx.currentTime);
    cueGain.gain.linearRampToValueAtTime(0.12 * this.volume, this.ctx.currentTime + 0.08);
    cueGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(cueGain);
    cueGain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }
}

export const sounds = new SoundEngine();

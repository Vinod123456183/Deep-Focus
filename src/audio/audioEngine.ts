export type Track =
  | "lofi"
  | "rain"
  | "binaural"
  | "nature"
  | "meditation"
  // | "piano"
  // | "white_noise"
  | "deep_focus"
  | "ocean"
  // | "fireplace"
  | "space"
  // | "jazz"
  | "sleep"
  // Real music file tracks (MP3s go in /public/music/)
  | "music_1"
  | "music_2"
  | "music_3"
  | "music_4"
  | "music_5";

// ─── EDIT THESE to match your actual filenames in /public/music/ ───────────
export const MUSIC_FILES: Partial<Record<Track, { file: string; label: string; icon: string; desc: string }>> = {
  music_1: { file: "/music/track1.mp3", label: "Shyam G", icon: "🎵", desc: "Shyam G Bhajan" },
  music_2: { file: "/music/track2.mp3", label: "Ram G", icon: "🎶", desc: "Ram G Bhajan" },
  music_3: { file: "/music/track3.mp3", label: "Shree Krishna", icon: "🎼", desc: "Shree Krishna Bhajan" },
  // music_4: { file: "/music/track4.mp3", label: "Track 4", icon: "🔊", desc: "Your music file 4" },
  // music_5: { file: "/music/track5.mp3", label: "Track 5", icon: "🎙️", desc: "Your music file 5" },
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];
  private intervals: ReturnType<typeof setInterval>[] = [];
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private htmlAudio: HTMLAudioElement | null = null;
  private _volume = 0.35;

  private init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this._volume;
    this.masterGain.connect(this.ctx.destination);
  }

  private stopNodes() {
    this.nodes.forEach((n) => {
      try {
        (n as OscillatorNode).stop?.();
        n.disconnect();
      } catch { }
    });
    this.nodes = [];
  }

  private clearTimers() {
    this.intervals.forEach(clearInterval);
    this.timeouts.forEach(clearTimeout);
    this.intervals = [];
    this.timeouts = [];
  }

  private stopHtmlAudio() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.src = "";
      this.htmlAudio = null;
    }
  }

  stop() {
    this.clearTimers();
    this.stopNodes();
    this.stopHtmlAudio();
  }

  setVolume(v: number) {
    this._volume = v;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.3);
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = v;
    }
  }

  play(track: Track) {
    this.stop();

    if (MUSIC_FILES[track]) {
      this.playMusicFile(track);
      return;
    }

    this.init();
    const map: Record<string, () => void> = {
      lofi: () => this.playLofi(),
      rain: () => this.playRain(),
      binaural: () => this.playBinaural(),
      nature: () => this.playNature(),
      meditation: () => this.playMeditation(),
      // piano: () => this.playPiano(),
      // white_noise: () => this.playWhiteNoise(),
      deep_focus: () => this.playDeepFocus(),
      ocean: () => this.playOcean(),
      // fireplace: () => this.playFireplace(),
      space: () => this.playSpace(),
      // jazz: () => this.playJazz(),
      sleep: () => this.playSleep(),
    };
    map[track]?.();
  }

  private playMusicFile(track: Track) {
    const entry = MUSIC_FILES[track];
    if (!entry) return;
    const audio = new Audio(entry.file);
    audio.loop = true;
    audio.volume = this._volume;
    audio.play().catch((e) => console.warn("Playback blocked:", e));
    this.htmlAudio = audio;
  }

  // ─── Synthesized Tracks ───────────────────────────────────────────

  private playLofi() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const chords = [
      [220, 261.63, 329.63],
      [174.61, 220, 261.63],
      [130.81, 164.81, 196],
      [196, 246.94, 293.66],
    ];
    let beat = 0;
    const scheduleChord = () => {
      const chord = chords[beat % chords.length];
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = "sine";
        osc.frequency.value = freq;
        filter.type = "lowpass";
        filter.frequency.value = 800;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12 - i * 0.02, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
        osc.connect(filter); filter.connect(gain); gain.connect(out);
        osc.start(); osc.stop(ctx.currentTime + 3.6);
        this.nodes.push(osc, gain, filter);
      });
      beat++;
    };
    scheduleChord();
    this.intervals.push(setInterval(scheduleChord, 3800));
    this.intervals.push(setInterval(() => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++)
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 500);
      const src = ctx.createBufferSource();
      const g = ctx.createGain(); g.gain.value = 0.04;
      const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 6000;
      src.buffer = buf; src.connect(f); f.connect(g); g.connect(out); src.start();
      this.nodes.push(src, g, f);
    }, 600));
  }

  private playRain() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 800; f1.Q.value = 0.5;
    const f2 = ctx.createBiquadFilter(); f2.type = "highshelf"; f2.frequency.value = 3000; f2.gain.value = -8;
    const g = ctx.createGain(); g.gain.value = 0.7;
    src.connect(f1); f1.connect(f2); f2.connect(g); g.connect(out); src.start();
    this.nodes.push(src, f1, f2, g);
    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.3) return;
      const rbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const rd = rbuf.getChannelData(0);
      for (let i = 0; i < rd.length; i++) rd[i] = (Math.random() * 2 - 1) * Math.exp(-i / 8000);
      const rs = ctx.createBufferSource(); rs.buffer = rbuf;
      const rf = ctx.createBiquadFilter(); rf.type = "lowpass"; rf.frequency.value = 200;
      const rg = ctx.createGain(); rg.gain.value = 0.3;
      rs.connect(rf); rf.connect(rg); rg.connect(out); rs.start();
      this.nodes.push(rs, rf, rg);
    }, 8000));
  }

  private playBinaural() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const merger = ctx.createChannelMerger(2);
    ([[200, 0], [240, 1]] as [number, number][]).forEach(([freq, ch]) => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = freq;
      const g = ctx.createGain(); g.gain.value = 0.2;
      osc.connect(g); g.connect(merger, 0, ch); osc.start(); this.nodes.push(osc, g);
    });
    merger.connect(out); this.nodes.push(merger);
    const drone = ctx.createOscillator(); drone.type = "sine"; drone.frequency.value = 110;
    const dg = ctx.createGain(); dg.gain.value = 0.06;
    drone.connect(dg); dg.connect(out); drone.start(); this.nodes.push(drone, dg);
  }

  private playNature() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const wbuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const wd = wbuf.getChannelData(0);
    for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1;
    const ws = ctx.createBufferSource(); ws.buffer = wbuf; ws.loop = true;
    const wf = ctx.createBiquadFilter(); wf.type = "bandpass"; wf.frequency.value = 400; wf.Q.value = 0.3;
    const wg = ctx.createGain(); wg.gain.value = 0.25;
    ws.connect(wf); wf.connect(wg); wg.connect(out); ws.start();
    this.nodes.push(ws, wf, wg);
    this.intervals.push(setInterval(() => {
      if (Math.random() > 0.4) return;
      const osc = ctx.createOscillator(); osc.type = "sine";
      const freq = 2000 + Math.random() * 1500;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, ctx.currentTime + 0.25);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.35);
      this.nodes.push(osc, g);
    }, 1200));
  }

  private playMeditation() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    [110, 165, 220, 330, 440].forEach((f) => {
      [0, 1.5, -1.5].forEach((detune) => {
        const osc = ctx.createOscillator(); osc.type = "sine";
        osc.frequency.value = f; osc.detune.value = detune;
        const g = ctx.createGain(); g.gain.value = 0.04;
        osc.connect(g); g.connect(out); osc.start(); this.nodes.push(osc, g);
      });
    });
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain); lfoGain.connect(out); lfo.start();
    this.nodes.push(lfo, lfoGain);
  }

  // private playPiano() {
  //   const ctx = this.ctx!;
  //   const out = this.masterGain!;
  //   const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
  //   let ni = 0;
  //   const playNote = () => {
  //     const freq = scale[ni % scale.length]; ni++;
  //     const osc = ctx.createOscillator(); osc.type = "triangle"; osc.frequency.value = freq;
  //     const osc2 = ctx.createOscillator(); osc2.type = "sine"; osc2.frequency.value = freq * 2;
  //     const env = ctx.createGain();
  //     env.gain.setValueAtTime(0, ctx.currentTime);
  //     env.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.02);
  //     env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
  //     const env2 = ctx.createGain();
  //     env2.gain.setValueAtTime(0, ctx.currentTime);
  //     env2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
  //     env2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
  //     osc.connect(env); osc2.connect(env2); env.connect(out); env2.connect(out);
  //     osc.start(); osc2.start(); osc.stop(ctx.currentTime + 2.1); osc2.stop(ctx.currentTime + 1.5);
  //     this.nodes.push(osc, osc2, env, env2);
  //     this.timeouts.push(setTimeout(playNote, 1400 + Math.random() * 900));
  //   };
  //   playNote();
  // }

  // private playWhiteNoise() {
  //   const ctx = this.ctx!;
  //   const out = this.masterGain!;
  //   const bufSize = ctx.sampleRate * 4;
  //   const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
  //   for (let c = 0; c < 2; c++) {
  //     const d = buf.getChannelData(c);
  //     for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  //   }
  //   const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  //   const g = ctx.createGain(); g.gain.value = 0.55;
  //   src.connect(g); g.connect(out); src.start();
  //   this.nodes.push(src, g);
  // }

  private playDeepFocus() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    ([40, 80, 160] as number[]).forEach((f, i) => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = [0.1, 0.07, 0.03][i];
      osc.connect(g); g.connect(out); osc.start(); this.nodes.push(osc, g);
    });
    const nbuf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const nd = nbuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const nsrc = ctx.createBufferSource(); nsrc.buffer = nbuf; nsrc.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = "lowpass"; nf.frequency.value = 300;
    const ng = ctx.createGain(); ng.gain.value = 0.06;
    nsrc.connect(nf); nf.connect(ng); ng.connect(out); nsrc.start();
    this.nodes.push(nsrc, nf, ng);
    const swell = () => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 120 + Math.random() * 80;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 7);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 8);
      this.nodes.push(osc, g);
      this.timeouts.push(setTimeout(swell, 6000 + Math.random() * 4000));
    };
    swell();
  }

  private playOcean() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const bufSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 600; f.Q.value = 0.4;
    const g = ctx.createGain(); g.gain.value = 0.35;
    src.connect(f); f.connect(g); g.connect(out); src.start();
    this.nodes.push(src, f, g);
    const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.2;
    lfo.connect(lfoGain); lfoGain.connect(g.gain as any); lfo.start();
    this.nodes.push(lfo, lfoGain);
  }

  // private playFireplace() {
  //   const ctx = this.ctx!;
  //   const out = this.masterGain!;
  //   const bufSize = ctx.sampleRate * 3;
  //   const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  //   const d = buf.getChannelData(0);
  //   for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  //   const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  //   const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1000; f.Q.value = 0.8;
  //   const g = ctx.createGain(); g.gain.value = 0.3;
  //   src.connect(f); f.connect(g); g.connect(out); src.start();
  //   this.nodes.push(src, f, g);
  //   const rumble = ctx.createOscillator(); rumble.type = "sine"; rumble.frequency.value = 55;
  //   const rg = ctx.createGain(); rg.gain.value = 0.04;
  //   rumble.connect(rg); rg.connect(out); rumble.start(); this.nodes.push(rumble, rg);
  //   const crackle = () => {
  //     const cbuf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  //     const cd = cbuf.getChannelData(0);
  //     for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cd.length);
  //     const cs = ctx.createBufferSource(); cs.buffer = cbuf;
  //     const cg = ctx.createGain(); cg.gain.value = 0.07 + Math.random() * 0.07;
  //     cs.connect(cg); cg.connect(out); cs.start();
  //     this.nodes.push(cs, cg);
  //     this.timeouts.push(setTimeout(crackle, 80 + Math.random() * 350));
  //   };
  //   crackle();
  // }

  private playSpace() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    [55, 82.4, 110, 164.8].forEach((f) => {
      [0, 1.2, -1.2].forEach((detune) => {
        const osc = ctx.createOscillator(); osc.type = "sine";
        osc.frequency.value = f; osc.detune.value = detune;
        const g = ctx.createGain(); g.gain.value = 0.03;
        osc.connect(g); g.connect(out); osc.start(); this.nodes.push(osc, g);
      });
    });
    const shimmer = () => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = 400 + Math.random() * 900;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 1.5);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
      osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 4.5);
      this.nodes.push(osc, g);
      this.timeouts.push(setTimeout(shimmer, 2500 + Math.random() * 3500));
    };
    shimmer();
  }

  // private playJazz() {
  //   const ctx = this.ctx!;
  //   const out = this.masterGain!;
  //   const bassNotes = [110, 123.47, 130.81, 146.83, 164.81, 174.61, 196.0];
  //   let bi = 0;
  //   const playBass = () => {
  //     const f = bassNotes[bi % bassNotes.length]; bi++;
  //     const osc = ctx.createOscillator(); osc.type = "triangle"; osc.frequency.value = f;
  //     const g = ctx.createGain();
  //     g.gain.setValueAtTime(0, ctx.currentTime);
  //     g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
  //     g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  //     osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.7);
  //     this.nodes.push(osc, g);
  //   };
  //   playBass();
  //   this.intervals.push(setInterval(playBass, 400));
  //   const melodyScale = [220, 246.94, 261.63, 293.66, 329.63, 369.99, 392.0, 440.0];
  //   this.intervals.push(setInterval(() => {
  //     if (Math.random() > 0.55) return;
  //     const f = melodyScale[Math.floor(Math.random() * melodyScale.length)];
  //     const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = f;
  //     const g = ctx.createGain();
  //     g.gain.setValueAtTime(0, ctx.currentTime);
  //     g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
  //     g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  //     osc.connect(g); g.connect(out); osc.start(); osc.stop(ctx.currentTime + 0.45);
  //     this.nodes.push(osc, g);
  //   }, 280));
  //   const nbuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  //   const nd = nbuf.getChannelData(0);
  //   for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  //   const nsrc = ctx.createBufferSource(); nsrc.buffer = nbuf; nsrc.loop = true;
  //   const nf = ctx.createBiquadFilter(); nf.type = "highpass"; nf.frequency.value = 4000;
  //   const ng = ctx.createGain(); ng.gain.value = 0.03;
  //   nsrc.connect(nf); nf.connect(ng); ng.connect(out); nsrc.start();
  //   this.nodes.push(nsrc, nf, ng);
  // }

  private playSleep() {
    const ctx = this.ctx!;
    const out = this.masterGain!;
    const merger = ctx.createChannelMerger(2);
    ([[100, 0], [102, 1]] as [number, number][]).forEach(([freq, ch]) => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = freq;
      const g = ctx.createGain(); g.gain.value = 0.12;
      osc.connect(g); g.connect(merger, 0, ch); osc.start(); this.nodes.push(osc, g);
    });
    merger.connect(out); this.nodes.push(merger);
    const nbuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const nd = nbuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const nsrc = ctx.createBufferSource(); nsrc.buffer = nbuf; nsrc.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = "lowpass"; nf.frequency.value = 500;
    const ng = ctx.createGain(); ng.gain.value = 0.07;
    nsrc.connect(nf); nf.connect(ng); ng.connect(out); nsrc.start();
    this.nodes.push(nsrc, nf, ng);
  }

  destroy() {
    this.stop();
    this.ctx?.close();
    this.ctx = null;
  }
}

export const audioEngine = new AudioEngine();
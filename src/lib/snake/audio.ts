let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      ctx = new AC();
    } catch { ctx = null; }
  }
  return ctx;
}

function tone(opts: { freq: number; dur: number; type?: OscillatorType; vol?: number; sweep?: number; volume?: number }) {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, c.currentTime);
  if (opts.sweep) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freq + opts.sweep), c.currentTime + opts.dur);
  }
  const v = (opts.vol ?? 0.15) * (opts.volume ?? 1);
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(v, c.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + opts.dur);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + opts.dur + 0.02);
}

export const sfx = {
  eat(volume = 1) {
    tone({ freq: 660, dur: 0.08, type: "triangle", sweep: 220, vol: 0.18, volume });
    setTimeout(() => tone({ freq: 990, dur: 0.06, type: "sine", vol: 0.12, volume }), 40);
  },
  rare(volume = 1) {
    tone({ freq: 540, dur: 0.1, type: "triangle", sweep: 400, vol: 0.2, volume });
    setTimeout(() => tone({ freq: 880, dur: 0.12, type: "square", sweep: 320, vol: 0.14, volume }), 60);
  },
  click(volume = 1) {
    tone({ freq: 520, dur: 0.05, type: "square", vol: 0.08, volume });
  },
  over(volume = 1) {
    tone({ freq: 220, dur: 0.5, type: "sawtooth", sweep: -160, vol: 0.18, volume });
    setTimeout(() => tone({ freq: 110, dur: 0.6, type: "sine", sweep: -60, vol: 0.14, volume }), 120);
  },
  start(volume = 1) {
    tone({ freq: 440, dur: 0.08, type: "sine", vol: 0.12, volume });
    setTimeout(() => tone({ freq: 660, dur: 0.1, type: "sine", vol: 0.14, volume }), 60);
    setTimeout(() => tone({ freq: 880, dur: 0.12, type: "triangle", vol: 0.14, volume }), 130);
  },
};

export function haptic(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      (navigator as any).vibrate(pattern);
    }
  } catch {}
}
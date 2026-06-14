//#region src/lib/snake/audio.ts
var ctx = null;
function getCtx() {
	if (typeof window === "undefined") return null;
	if (!ctx) try {
		ctx = new (window.AudioContext || window.webkitAudioContext)();
	} catch {
		ctx = null;
	}
	return ctx;
}
function tone(opts) {
	const c = getCtx();
	if (!c) return;
	if (c.state === "suspended") c.resume().catch(() => {});
	const osc = c.createOscillator();
	const gain = c.createGain();
	osc.type = opts.type ?? "sine";
	osc.frequency.setValueAtTime(opts.freq, c.currentTime);
	if (opts.sweep) osc.frequency.exponentialRampToValueAtTime(Math.max(40, opts.freq + opts.sweep), c.currentTime + opts.dur);
	const v = (opts.vol ?? .15) * (opts.volume ?? 1);
	gain.gain.setValueAtTime(1e-4, c.currentTime);
	gain.gain.exponentialRampToValueAtTime(v, c.currentTime + .01);
	gain.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + opts.dur);
	osc.connect(gain).connect(c.destination);
	osc.start();
	osc.stop(c.currentTime + opts.dur + .02);
}
var sfx = {
	eat(volume = 1) {
		tone({
			freq: 660,
			dur: .08,
			type: "triangle",
			sweep: 220,
			vol: .18,
			volume
		});
		setTimeout(() => tone({
			freq: 990,
			dur: .06,
			type: "sine",
			vol: .12,
			volume
		}), 40);
	},
	rare(volume = 1) {
		tone({
			freq: 540,
			dur: .1,
			type: "triangle",
			sweep: 400,
			vol: .2,
			volume
		});
		setTimeout(() => tone({
			freq: 880,
			dur: .12,
			type: "square",
			sweep: 320,
			vol: .14,
			volume
		}), 60);
	},
	click(volume = 1) {
		tone({
			freq: 520,
			dur: .05,
			type: "square",
			vol: .08,
			volume
		});
	},
	over(volume = 1) {
		tone({
			freq: 220,
			dur: .5,
			type: "sawtooth",
			sweep: -160,
			vol: .18,
			volume
		});
		setTimeout(() => tone({
			freq: 110,
			dur: .6,
			type: "sine",
			sweep: -60,
			vol: .14,
			volume
		}), 120);
	},
	start(volume = 1) {
		tone({
			freq: 440,
			dur: .08,
			type: "sine",
			vol: .12,
			volume
		});
		setTimeout(() => tone({
			freq: 660,
			dur: .1,
			type: "sine",
			vol: .14,
			volume
		}), 60);
		setTimeout(() => tone({
			freq: 880,
			dur: .12,
			type: "triangle",
			vol: .14,
			volume
		}), 130);
	}
};
function haptic(pattern) {
	try {
		if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
	} catch {}
}
//#endregion
export { sfx as n, haptic as t };

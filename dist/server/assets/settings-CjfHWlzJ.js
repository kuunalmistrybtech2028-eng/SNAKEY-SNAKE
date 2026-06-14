import { useEffect, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/snake/NeonBackground.tsx
/**
* Lightweight animated neon cyber-grid background.
* Renders to a single low-resolution canvas with cheap effects.
* Now with enhanced visual effects and more dynamic animations.
*/
function NeonBackground({ intensity = 1, theme }) {
	const ref = useRef(null);
	useEffect(() => {
		const c = ref.current;
		const ctx = c.getContext("2d", { alpha: true });
		let raf = 0;
		let w = 0, h = 0, dpr = 1;
		const dots = [];
		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = c.clientWidth;
			h = c.clientHeight;
			c.width = Math.floor(w * dpr);
			c.height = Math.floor(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			dots.length = 0;
			const n = Math.round(Math.min(40, w * h / 3e4) * intensity);
			for (let i = 0; i < n; i++) dots.push({
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - .5) * .18,
				vy: (Math.random() - .5) * .18,
				r: .6 + Math.random() * 1.8,
				hue: 190 + Math.random() * 130
			});
		};
		resize();
		window.addEventListener("resize", resize);
		let t0 = 0;
		const loop = (t) => {
			raf = requestAnimationFrame(loop);
			if (!t0) t0 = t;
			const dt = Math.min(64, t - t0);
			t0 = t;
			ctx.clearRect(0, 0, w, h);
			const tm = t / 8e3;
			const blob = (cx, cy, color, r) => {
				const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
				g.addColorStop(0, color);
				g.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = g;
				ctx.fillRect(0, 0, w, h);
			};
			if (theme === "candy-land") {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(255,85,196,0.22)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(255,170,0,0.2)", Math.max(w, h) * .55);
			} else if (theme === "ice-crystal") {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(126,243,255,0.2)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(100,200,255,0.18)", Math.max(w, h) * .55);
			} else if (theme === "inferno-blaze") {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(255,85,0,0.24)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(255,40,0,0.2)", Math.max(w, h) * .55);
			} else if (theme === "tropical-vibes") {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(255,170,0,0.2)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(0,200,100,0.18)", Math.max(w, h) * .55);
			} else if (theme === "electric-storm") {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(0,255,255,0.22)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(100,200,255,0.2)", Math.max(w, h) * .55);
			} else {
				blob(w * (.3 + Math.sin(tm) * .12), h * (.35 + Math.cos(tm) * .1), "rgba(34,211,238,0.2)", Math.max(w, h) * .55);
				blob(w * (.7 + Math.cos(tm * 1.3) * .1), h * (.65 + Math.sin(tm * .9) * .12), "rgba(168,85,247,0.18)", Math.max(w, h) * .55);
			}
			blob(w * (.5 + Math.sin(tm * .7) * .18), h * (.85 + Math.cos(tm * 1.1) * .05), "rgba(244,114,182,0.14)", Math.max(w, h) * .5);
			ctx.strokeStyle = "rgba(125,249,255,0.08)";
			ctx.lineWidth = 1.2;
			const step = 48;
			ctx.beginPath();
			const off = t / 60 % step;
			for (let x = -off; x < w; x += step) {
				ctx.moveTo(x, 0);
				ctx.lineTo(x, h);
			}
			for (let y = -off; y < h; y += step) {
				ctx.moveTo(0, y);
				ctx.lineTo(w, y);
			}
			ctx.stroke();
			for (const d of dots) {
				d.x += d.vx * (dt / 16);
				d.y += d.vy * (dt / 16);
				if (d.x < -10) d.x = w + 10;
				if (d.x > w + 10) d.x = -10;
				if (d.y < -10) d.y = h + 10;
				if (d.y > h + 10) d.y = -10;
				ctx.fillStyle = `hsla(${d.hue}, 95%, 65%, 0.7)`;
				ctx.shadowColor = `hsl(${d.hue}, 95%, 70%)`;
				ctx.shadowBlur = 16;
				ctx.beginPath();
				ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.shadowBlur = 0;
			const pulse = Math.sin(t / 1500) * .5 + .5;
			ctx.fillStyle = `rgba(125,249,255,${pulse * .04})`;
			ctx.beginPath();
			ctx.arc(w / 2, h / 2, Math.max(w, h) * .3 * pulse, 0, Math.PI * 2);
			ctx.fill();
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, [intensity, theme]);
	return /* @__PURE__ */ jsx("canvas", {
		ref,
		"aria-hidden": true,
		className: "fixed inset-0 w-full h-full -z-10 pointer-events-none",
		style: { background: "radial-gradient(ellipse at 50% 0%, #1a0633 0%, #07020f 70%)" }
	});
}
//#endregion
//#region src/lib/snake/settings.ts
var DEFAULT_SETTINGS = {
	grid: true,
	wallWrap: false,
	fpsLimit: "auto",
	graphics: "high",
	particles: "medium",
	background: true,
	swipe: true,
	sound: true,
	music: false,
	haptics: true,
	soundVolume: .8,
	musicVolume: .5,
	performance: "balanced",
	skin: "cyber",
	trail: "none",
	head: "none",
	theme: "cyber-grid"
};
var KEY = "snakey:settings:v1";
var HS_KEY = "snakey:highscore:v1";
var COIN_KEY = "snakey:coins:v1";
var SKIN_KEY = "snakey:ownedSkins:v1";
var MISSION_KEY = "snakey:missions:v1";
var PROG_KEY = "snakey:progression:v1";
var STATS_KEY = "snakey:stats:v1";
var ACH_KEY = "snakey:achievements:v1";
var DAILY_KEY = "snakey:daily:v1";
var LOGIN_KEY = "snakey:login:v1";
var OWN_KEY = "snakey:owned:v1";
function loadSettings() {
	if (typeof window === "undefined") return DEFAULT_SETTINGS;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return DEFAULT_SETTINGS;
		return {
			...DEFAULT_SETTINGS,
			...JSON.parse(raw)
		};
	} catch {
		return DEFAULT_SETTINGS;
	}
}
function saveSettings(s) {
	try {
		localStorage.setItem(KEY, JSON.stringify(s));
	} catch {}
}
function useSettings() {
	const [s, setS] = useState(DEFAULT_SETTINGS);
	useEffect(() => {
		setS(loadSettings());
	}, []);
	const patch = (p) => {
		setS((prev) => {
			const next = {
				...prev,
				...p
			};
			saveSettings(next);
			return next;
		});
	};
	return [s, patch];
}
function getHighScore(mode) {
	if (typeof window === "undefined") return 0;
	try {
		const raw = localStorage.getItem(HS_KEY);
		return (raw ? JSON.parse(raw) : {})[mode] ?? 0;
	} catch {
		return 0;
	}
}
function setHighScore(mode, score) {
	try {
		const raw = localStorage.getItem(HS_KEY);
		const map = raw ? JSON.parse(raw) : {};
		if (score > (map[mode] ?? 0)) {
			map[mode] = score;
			localStorage.setItem(HS_KEY, JSON.stringify(map));
		}
	} catch {}
}
function getCoins() {
	if (typeof window === "undefined") return 0;
	try {
		return parseInt(localStorage.getItem(COIN_KEY) || "0", 10) || 0;
	} catch {
		return 0;
	}
}
function addCoins(n) {
	try {
		localStorage.setItem(COIN_KEY, String(getCoins() + n));
	} catch {}
}
function getOwnedSkins() {
	if (typeof window === "undefined") return ["cyber"];
	try {
		const raw = localStorage.getItem(SKIN_KEY);
		return raw ? JSON.parse(raw) : ["cyber"];
	} catch {
		return ["cyber"];
	}
}
function buySkin(id) {
	const owned = getOwnedSkins();
	if (!owned.includes(id)) {
		owned.push(id);
		try {
			localStorage.setItem(SKIN_KEY, JSON.stringify(owned));
		} catch {}
	}
}
var DEFAULT_OWNED = {
	trails: ["none"],
	heads: ["none"],
	themes: ["cyber-grid"]
};
function getOwned() {
	if (typeof window === "undefined") return DEFAULT_OWNED;
	try {
		const raw = localStorage.getItem(OWN_KEY);
		if (!raw) return DEFAULT_OWNED;
		const p = JSON.parse(raw);
		return {
			trails: Array.from(new Set(["none", ...p.trails ?? []])),
			heads: Array.from(new Set(["none", ...p.heads ?? []])),
			themes: Array.from(new Set(["cyber-grid", ...p.themes ?? []]))
		};
	} catch {
		return DEFAULT_OWNED;
	}
}
function buyCosmetic(kind, id) {
	const o = getOwned();
	if (!o[kind].includes(id)) {
		o[kind].push(id);
		try {
			localStorage.setItem(OWN_KEY, JSON.stringify(o));
		} catch {}
	}
}
var DEFAULT_MISSIONS = {
	foodEaten: 0,
	gamesPlayed: 0,
	bestScore: 0,
	totalScore: 0
};
function getMissions() {
	if (typeof window === "undefined") return DEFAULT_MISSIONS;
	try {
		const raw = localStorage.getItem(MISSION_KEY);
		return raw ? {
			...DEFAULT_MISSIONS,
			...JSON.parse(raw)
		} : DEFAULT_MISSIONS;
	} catch {
		return DEFAULT_MISSIONS;
	}
}
function updateMissions(patch) {
	const next = {
		...getMissions(),
		...patch
	};
	try {
		localStorage.setItem(MISSION_KEY, JSON.stringify(next));
	} catch {}
}
var DEFAULT_PROG = {
	xp: 0,
	level: 1,
	totalXp: 0
};
function xpForLevel(level) {
	return Math.round(50 + level * 35 + Math.pow(level, 1.55) * 6);
}
function getProgression() {
	if (typeof window === "undefined") return DEFAULT_PROG;
	try {
		const raw = localStorage.getItem(PROG_KEY);
		return raw ? {
			...DEFAULT_PROG,
			...JSON.parse(raw)
		} : DEFAULT_PROG;
	} catch {
		return DEFAULT_PROG;
	}
}
function saveProgression(p) {
	try {
		localStorage.setItem(PROG_KEY, JSON.stringify(p));
	} catch {}
}
/**
* Add XP, return { progression, levelsGained, levelUps:[{level, reward}] }
*/
/** Preview level-ups from XP gain without persisting — used during gameplay. */
function previewLevelUps(startLevel, startXp, xpGain) {
	let level = startLevel;
	let xp = startXp + Math.max(0, xpGain);
	const rewards = [];
	while (level < 200 && xp >= xpForLevel(level)) {
		xp -= xpForLevel(level);
		level += 1;
		const coins = 50 + level * 10;
		const box = level % 5 === 0;
		rewards.push({
			level,
			coins,
			box
		});
	}
	if (level >= 200) xp = 0;
	return {
		level,
		xp,
		rewards
	};
}
function addXp(amount) {
	const p = getProgression();
	p.totalXp += Math.max(0, amount);
	p.xp += Math.max(0, amount);
	const rewards = [];
	let gained = 0;
	while (p.level < 200 && p.xp >= xpForLevel(p.level)) {
		p.xp -= xpForLevel(p.level);
		p.level += 1;
		gained += 1;
		const coins = 50 + p.level * 10;
		const box = p.level % 5 === 0;
		addCoins(coins);
		if (box) openMysteryBoxFromLevel();
		rewards.push({
			level: p.level,
			coins,
			box
		});
	}
	if (p.level >= 200) p.xp = 0;
	saveProgression(p);
	return {
		prog: p,
		levelsGained: gained,
		rewards
	};
}
function openMysteryBoxFromLevel() {
	const s = getStats();
	saveStats({
		...s,
		mysteryBoxes: s.mysteryBoxes + 1
	});
}
var DEFAULT_STATS = {
	highestScore: 0,
	longestSnake: 0,
	totalFruits: 0,
	totalRare: 0,
	totalGames: 0,
	totalSurvivalMs: 0,
	achievementsCompleted: 0,
	missionsCompleted: 0,
	loginStreak: 0,
	bestLoginStreak: 0,
	mysteryBoxes: 0,
	totalCoinsEarned: 0
};
function getStats() {
	if (typeof window === "undefined") return DEFAULT_STATS;
	try {
		const raw = localStorage.getItem(STATS_KEY);
		return raw ? {
			...DEFAULT_STATS,
			...JSON.parse(raw)
		} : DEFAULT_STATS;
	} catch {
		return DEFAULT_STATS;
	}
}
function saveStats(s) {
	try {
		localStorage.setItem(STATS_KEY, JSON.stringify(s));
	} catch {}
}
function patchStats(patch) {
	saveStats({
		...getStats(),
		...patch
	});
}
function addCoinsTracked(n) {
	if (n > 0) {
		const s = getStats();
		saveStats({
			...s,
			totalCoinsEarned: s.totalCoinsEarned + n
		});
	}
	addCoins(n);
}
function getCompletedAchievements() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(ACH_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function markAchievementCompleted(id) {
	const list = getCompletedAchievements();
	if (!list.includes(id)) {
		list.push(id);
		try {
			localStorage.setItem(ACH_KEY, JSON.stringify(list));
		} catch {}
		saveStats({
			...getStats(),
			achievementsCompleted: list.length
		});
	}
}
function todayKey() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}
function getDaily() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(DAILY_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function saveDaily(d) {
	try {
		localStorage.setItem(DAILY_KEY, JSON.stringify(d));
	} catch {}
}
var DEFAULT_LOGIN = {
	lastDay: null,
	index: 0,
	claimedToday: false
};
function getLogin() {
	if (typeof window === "undefined") return DEFAULT_LOGIN;
	try {
		const raw = localStorage.getItem(LOGIN_KEY);
		return raw ? {
			...DEFAULT_LOGIN,
			...JSON.parse(raw)
		} : DEFAULT_LOGIN;
	} catch {
		return DEFAULT_LOGIN;
	}
}
function saveLogin(l) {
	try {
		localStorage.setItem(LOGIN_KEY, JSON.stringify(l));
	} catch {}
}
function exportSaveData() {
	const data = {};
	const keys = [
		KEY,
		HS_KEY,
		COIN_KEY,
		SKIN_KEY,
		MISSION_KEY,
		PROG_KEY,
		STATS_KEY,
		ACH_KEY,
		DAILY_KEY,
		LOGIN_KEY,
		OWN_KEY
	];
	for (const k of keys) try {
		data[k] = localStorage.getItem(k);
	} catch {}
	return JSON.stringify(data);
}
function importSaveData(jsonStr) {
	try {
		const data = JSON.parse(jsonStr);
		const keys = [
			KEY,
			HS_KEY,
			COIN_KEY,
			SKIN_KEY,
			MISSION_KEY,
			PROG_KEY,
			STATS_KEY,
			ACH_KEY,
			DAILY_KEY,
			LOGIN_KEY,
			OWN_KEY
		];
		for (const k of keys) if (k in data) if (data[k] === null) localStorage.removeItem(k);
		else localStorage.setItem(k, data[k]);
		return true;
	} catch {
		return false;
	}
}
function resetSaveData() {
	const keys = [
		KEY,
		HS_KEY,
		COIN_KEY,
		SKIN_KEY,
		MISSION_KEY,
		PROG_KEY,
		STATS_KEY,
		ACH_KEY,
		DAILY_KEY,
		LOGIN_KEY,
		OWN_KEY
	];
	for (const k of keys) try {
		localStorage.removeItem(k);
	} catch {}
}
//#endregion
export { xpForLevel as A, saveDaily as C, todayKey as D, setHighScore as E, updateMissions as O, resetSaveData as S, saveStats as T, importSaveData as _, buySkin as a, patchStats as b, getCompletedAchievements as c, getLogin as d, getMissions as f, getStats as g, getProgression as h, buyCosmetic as i, NeonBackground as j, useSettings as k, getDaily as l, getOwnedSkins as m, addCoinsTracked as n, exportSaveData as o, getOwned as p, addXp as r, getCoins as s, addCoins as t, getHighScore as u, loadSettings as v, saveLogin as w, previewLevelUps as x, markAchievementCompleted as y };

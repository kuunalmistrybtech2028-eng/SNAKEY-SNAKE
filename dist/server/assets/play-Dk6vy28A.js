import { t as Route } from "./play-Bkh71OT_.js";
import { E as setHighScore, O as updateMissions, T as saveStats, b as patchStats, f as getMissions, g as getStats, h as getProgression, i as buyCosmetic, j as NeonBackground, n as addCoinsTracked, p as getOwned, r as addXp, u as getHighScore, v as loadSettings, x as previewLevelUps } from "./settings-CjfHWlzJ.js";
import { n as checkAchievements } from "./achievements-MlWpzmg1.js";
import { a as getTheme, i as getHead, n as THEMES, o as getTrail, r as TRAILS, t as HEADS } from "./cosmetics-DmwcBj5z.js";
import { n as sfx, t as haptic } from "./audio-BNzA2mo5.js";
import { n as saveLastSession } from "./runSession-CFxS0atv.js";
import { a as syncDailyDuringRun, t as claimAllCompletedDaily } from "./dailyMissions-pEkP6oH8.js";
import { n as getSkin } from "./skins-Dlwzes_v.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/lib/snake/mysteryBox.ts
function rollMysteryBoxReward() {
	const owned = getOwned();
	const lockedTrails = TRAILS.filter((t) => t.id !== "none" && !owned.trails.includes(t.id));
	const lockedHeads = HEADS.filter((h) => h.id !== "none" && !owned.heads.includes(h.id));
	const lockedThemes = THEMES.filter((t) => !owned.themes.includes(t.id));
	const roll = Math.random();
	if (lockedTrails.length && roll < .1) {
		const c = lockedTrails[Math.floor(Math.random() * lockedTrails.length)];
		return {
			kind: "trail",
			cosmeticId: c.id,
			label: `${c.name} Trail`
		};
	}
	if (lockedHeads.length && roll < .15) {
		const c = lockedHeads[Math.floor(Math.random() * lockedHeads.length)];
		return {
			kind: "head",
			cosmeticId: c.id,
			label: `${c.name}`
		};
	}
	if (lockedThemes.length && roll < .2) {
		const c = lockedThemes[Math.floor(Math.random() * lockedThemes.length)];
		return {
			kind: "theme",
			cosmeticId: c.id,
			label: `${c.name} Theme`
		};
	}
	if (roll < .9) {
		const amt = 50 + Math.floor(Math.random() * 450);
		return {
			kind: "coins",
			amount: amt,
			label: `${amt} Coins`
		};
	}
	const xp = 100 + Math.floor(Math.random() * 400);
	return {
		kind: "xp",
		amount: xp,
		label: `${xp} XP`
	};
}
function applyBoxReward(reward) {
	switch (reward.kind) {
		case "trail":
			if (reward.cosmeticId) buyCosmetic("trails", reward.cosmeticId);
			break;
		case "head":
			if (reward.cosmeticId) buyCosmetic("heads", reward.cosmeticId);
			break;
		case "theme":
			if (reward.cosmeticId) buyCosmetic("themes", reward.cosmeticId);
			break;
		case "coins":
			if (reward.amount) addCoinsTracked(reward.amount);
			break;
		case "xp":
			if (reward.amount) addXp(reward.amount);
			break;
		case "boost": break;
	}
}
//#endregion
//#region src/components/snake/LevelUpToast.tsx
var TOAST_MS$1 = 2e3;
function LevelUpToast({ queue, onConsume }) {
	const [show, setShow] = useState(null);
	useEffect(() => {
		if (!show && queue.length) {
			setShow(queue[0]);
			const t = setTimeout(() => {
				setShow(null);
				onConsume();
			}, TOAST_MS$1);
			return () => clearTimeout(t);
		}
	}, [
		queue,
		show,
		onConsume
	]);
	if (!show) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up",
		children: /* @__PURE__ */ jsxs("div", {
			className: "neon-panel rounded-2xl px-6 py-3 text-center",
			style: { boxShadow: "0 0 30px rgba(125,249,255,.55), 0 0 80px rgba(167,139,250,.4)" },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[10px] tracking-[0.5em] uppercase text-muted-foreground",
					children: "Level Up"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-3xl font-extrabold neon-text",
					children: ["LV ", show.level]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-xs text-foreground/80 mt-0.5",
					children: [
						"+",
						show.coins,
						" coins",
						show.box ? " · Mystery Box" : ""
					]
				})
			]
		})
	});
}
function MissionCompleteToast({ queue, onConsume }) {
	const [show, setShow] = useState(null);
	useEffect(() => {
		if (!show && queue.length) {
			setShow(queue[0]);
			const t = setTimeout(() => {
				setShow(null);
				onConsume();
			}, TOAST_MS$1);
			return () => clearTimeout(t);
		}
	}, [
		queue,
		show,
		onConsume
	]);
	if (!show) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed top-36 left-1/2 -translate-x-1/2 z-50 animate-fade-up",
		children: /* @__PURE__ */ jsxs("div", {
			className: "neon-panel rounded-2xl px-6 py-3 text-center",
			style: { boxShadow: "0 0 30px rgba(57,255,136,.45), 0 0 60px rgba(125,249,255,.3)" },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[10px] tracking-[0.5em] uppercase text-muted-foreground",
					children: "Mission Complete"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-lg font-extrabold neon-text mt-0.5",
					children: show.label
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "text-xs text-foreground/80 mt-0.5",
					children: [
						"+",
						show.coins,
						" coins · +",
						show.xp,
						" XP"
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/snake/MysteryBoxToast.tsx
var TOAST_MS = 2e3;
/** Lightweight 2-second mystery box reveal during gameplay */
function MysteryBoxToast({ reward, onDone }) {
	useEffect(() => {
		const t = setTimeout(onDone, TOAST_MS);
		return () => clearTimeout(t);
	}, [onDone]);
	return /* @__PURE__ */ jsx("div", {
		className: "pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up",
		children: /* @__PURE__ */ jsxs("div", {
			className: "neon-panel rounded-2xl px-6 py-4 text-center",
			style: { boxShadow: "0 0 40px rgba(253,224,71,.5), 0 0 120px rgba(255,94,196,.4)" },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[10px] tracking-[0.5em] uppercase text-muted-foreground",
					children: "Mystery Box"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "my-2 flex items-center justify-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "w-14 h-14 rounded-xl animate-neon-pulse",
						style: {
							background: "linear-gradient(135deg,#fde047,#ff9551,#ff5ec4)",
							boxShadow: "0 0 30px rgba(253,224,71,.7)"
						}
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-xs uppercase tracking-widest text-muted-foreground",
					children: "You got"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-xl font-extrabold neon-text",
					children: reward.label
				})
			]
		})
	});
}
//#endregion
//#region src/components/snake/GameOverStats.tsx
function fmtTime(ms) {
	const s = Math.floor(ms / 1e3);
	const m = Math.floor(s / 60);
	const sec = s % 60;
	return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
function StatRow({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between py-2 border-b border-border/30 last:border-0",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground uppercase tracking-wider",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: "text-sm font-bold text-foreground",
			children: value
		})]
	});
}
function GameOverStats({ session, onPlayAgain }) {
	const { rewards } = session;
	const totalCoins = rewards.coinsFromFruit + rewards.coinsFromEnd + rewards.coinsFromLevelUps + rewards.boxRewards.reduce((s, r) => s + (r.kind === "coins" ? r.amount ?? 0 : 0), 0) + rewards.missionsCompleted.reduce((s, m) => s + m.coins, 0);
	return /* @__PURE__ */ jsx("div", {
		className: "absolute inset-0 rounded-2xl flex items-center justify-center bg-background/85 backdrop-blur-lg animate-fade-up overflow-y-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-sm px-5 py-6 space-y-4 my-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-[10px] uppercase tracking-[0.45em] text-muted-foreground",
							children: session.isNewRecord ? "New Record!" : "Run Complete"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-5xl font-extrabold neon-text animate-title-glow mt-1",
							children: session.score
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								"Best ",
								session.best,
								" · ",
								session.mode.replace("-", " ")
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-4 py-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-[10px] uppercase tracking-widest text-cyan-400 mb-1",
							children: "Run Stats"
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Survival",
							value: fmtTime(session.survivalMs)
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Snake Length",
							value: session.snakeLength
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Fruits Eaten",
							value: session.fruitsEaten
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Rare Fruits",
							value: session.rareFruits
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Mystery Boxes",
							value: session.boxesOpened
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Max Combo",
							value: `x${session.maxCombo}`
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-4 py-3",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "text-[10px] uppercase tracking-widest text-cyan-400 mb-1",
							children: "Rewards Collected"
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "Total Coins",
							value: `+${totalCoins}`
						}),
						/* @__PURE__ */ jsx(StatRow, {
							label: "XP Earned",
							value: `+${rewards.xpEarned}`
						}),
						rewards.levelUps.length > 0 && /* @__PURE__ */ jsx(StatRow, {
							label: "Level Ups",
							value: rewards.levelUps.map((l) => `Lv ${l.level}`).join(", ")
						}),
						rewards.boxRewards.length > 0 && /* @__PURE__ */ jsx(StatRow, {
							label: "Box Drops",
							value: rewards.boxRewards.map((b) => b.label).join(", ")
						}),
						rewards.missionsCompleted.length > 0 && /* @__PURE__ */ jsx(StatRow, {
							label: "Missions",
							value: rewards.missionsCompleted.map((m) => m.label).join(", ")
						}),
						rewards.achievementsUnlocked.length > 0 && /* @__PURE__ */ jsx(StatRow, {
							label: "Achievements",
							value: rewards.achievementsUnlocked.join(", ")
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2 pt-1",
					children: [/* @__PURE__ */ jsx("button", {
						className: "neon-btn neon-btn-hover w-full",
						onClick: onPlayAgain,
						children: "Play Again"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "neon-btn neon-btn-hover w-full text-center",
						children: "Home"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/lib/snake/fps.ts
var cachedRefreshRate = null;
/** Sample RAF timing to detect the display refresh rate (60, 90, or 120). */
function detectScreenRefreshRate() {
	if (cachedRefreshRate) return Promise.resolve(cachedRefreshRate);
	if (typeof window === "undefined") return Promise.resolve(60);
	return new Promise((resolve) => {
		const samples = [];
		let last = 0;
		const tick = (t) => {
			if (last) samples.push(t - last);
			last = t;
			if (samples.length < 30) requestAnimationFrame(tick);
			else {
				const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
				const hz = Math.round(1e3 / avg);
				cachedRefreshRate = hz >= 110 ? 120 : hz >= 85 ? 90 : 60;
				resolve(cachedRefreshRate);
			}
		};
		requestAnimationFrame(tick);
	});
}
function getEffectiveFpsLimit(setting, detectedHz = 60) {
	if (setting !== "auto") return setting;
	return detectedHz >= 110 ? 120 : detectedHz >= 85 ? 90 : 60;
}
//#endregion
//#region src/lib/snake/trailEffects.ts
function spawnTrailGhost(ghosts, x, y, maxLife = 520, maxCount = 90) {
	ghosts.push({
		x,
		y,
		life: maxLife,
		max: maxLife
	});
	if (ghosts.length > maxCount) ghosts.shift();
}
function drawTrailGhosts(ctx, trail, ghosts, cell, timeMs, blurMult) {
	if (trail.id === "none" || !ghosts.length) return;
	for (let i = 0; i < ghosts.length; i++) {
		const t = ghosts[i];
		const a = t.life / t.max;
		const cx = (t.x + .5) * cell;
		const cy = (t.y + .5) * cell;
		const baseR = cell * (.22 + a * .18);
		ctx.save();
		ctx.globalAlpha = a * .85;
		switch (trail.id) {
			case "lightning":
				ctx.strokeStyle = i % 2 === 0 ? trail.color : trail.secondary;
				ctx.lineWidth = Math.max(1.5, cell * .07 * a);
				ctx.shadowColor = trail.secondary;
				ctx.shadowBlur = 22 * blurMult;
				ctx.beginPath();
				ctx.moveTo(cx - baseR, cy);
				ctx.lineTo(cx, cy - baseR * 1.4);
				ctx.lineTo(cx + baseR * .6, cy + baseR * .3);
				ctx.lineTo(cx + baseR, cy - baseR * .5);
				ctx.stroke();
				break;
			case "fire": {
				const r = baseR * (.85 + .15 * Math.sin(timeMs / 80 + i));
				const g = ctx.createRadialGradient(cx, cy - r * .3, 0, cx, cy, r);
				g.addColorStop(0, "#fff8e7");
				g.addColorStop(.35, trail.color);
				g.addColorStop(1, trail.secondary + "00");
				ctx.fillStyle = g;
				ctx.shadowColor = trail.color;
				ctx.shadowBlur = 20 * blurMult;
				ctx.beginPath();
				ctx.arc(cx, cy, r, 0, Math.PI * 2);
				ctx.fill();
				break;
			}
			case "galaxy":
				ctx.fillStyle = `hsla(${(timeMs / 40 + i * 25) % 360}, 90%, 70%, ${a * .7})`;
				ctx.shadowColor = trail.secondary;
				ctx.shadowBlur = 18 * blurMult;
				ctx.beginPath();
				ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#ffffff";
				ctx.globalAlpha = a * .5;
				ctx.beginPath();
				ctx.arc(cx - baseR * .3, cy - baseR * .3, baseR * .25, 0, Math.PI * 2);
				ctx.fill();
				break;
			case "rainbow": {
				const hue = (timeMs / 30 + i * 18) % 360;
				ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
				ctx.shadowColor = `hsl(${hue}, 100%, 75%)`;
				ctx.shadowBlur = 16 * blurMult;
				ctx.beginPath();
				ctx.arc(cx, cy, baseR * 1.1, 0, Math.PI * 2);
				ctx.fill();
				break;
			}
			case "digital": {
				const sz = baseR * 1.2;
				ctx.fillStyle = i % 2 === 0 ? trail.color : trail.secondary;
				ctx.shadowColor = trail.secondary;
				ctx.shadowBlur = 14 * blurMult;
				ctx.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
				ctx.globalAlpha = a * .35;
				ctx.strokeStyle = trail.color;
				ctx.lineWidth = 1;
				ctx.strokeRect(cx - sz / 2, cy - sz / 2, sz, sz);
				break;
			}
			default:
				ctx.fillStyle = trail.color;
				ctx.shadowColor = trail.secondary;
				ctx.shadowBlur = 16 * blurMult;
				ctx.beginPath();
				ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
				ctx.fill();
		}
		ctx.restore();
	}
	ctx.globalAlpha = 1;
	ctx.shadowBlur = 0;
}
//#endregion
//#region src/components/snake/GameCanvas.tsx
function pickRareKind() {
	const r = Math.random();
	if (r < .5) return "golden";
	if (r < .75) return "rainbow";
	if (r < .9) return "energy";
	if (r < .98) return "diamond";
	return "legendary";
}
function fruitColor(k) {
	switch (k) {
		case "normal": return {
			main: "#ffd166",
			glow: "#ffb347"
		};
		case "golden": return {
			main: "#fde047",
			glow: "#facc15"
		};
		case "diamond": return {
			main: "#7df9ff",
			glow: "#22d3ee"
		};
		case "rainbow": return {
			main: "#ff5ec4",
			glow: "#7df9ff"
		};
		case "energy": return {
			main: "#39ff88",
			glow: "#84cc16"
		};
		case "legendary": return {
			main: "#fef3c7",
			glow: "#ff5ec4"
		};
	}
}
function fruitReward(k) {
	switch (k) {
		case "normal": return {
			score: 1,
			xp: 5,
			coins: 0
		};
		case "golden": return {
			score: 5,
			xp: 25,
			coins: 5
		};
		case "diamond": return {
			score: 10,
			xp: 80,
			coins: 10
		};
		case "rainbow": return {
			score: 3,
			xp: 30,
			coins: 3
		};
		case "energy": return {
			score: 3,
			xp: 30,
			coins: 3
		};
		case "legendary": return {
			score: 25,
			xp: 200,
			coins: 50
		};
	}
}
var DIRS = {
	up: {
		x: 0,
		y: -1
	},
	down: {
		x: 0,
		y: 1
	},
	left: {
		x: -1,
		y: 0
	},
	right: {
		x: 1,
		y: 0
	}
};
function opposite(a, b) {
	return a.x === -b.x && a.y === -b.y;
}
function dailyUpdater(s) {
	const survivalMs = performance.now() - s.runStart;
	return (mi) => {
		if (mi.metric === "scoreThisRun") return Math.max(mi.progress, s.score);
		if (mi.metric === "fruits") return mi.progress + s.eatenCount;
		if (mi.metric === "rare") return mi.progress + s.rareCount;
		if (mi.metric === "boxes") return mi.progress + s.boxesOpened;
		if (mi.metric === "survivalMs") return mi.progress + survivalMs;
		if (mi.metric === "games") return mi.progress + 1;
		if (mi.metric === "combo") return Math.max(mi.progress, s.comboCount);
		return mi.progress;
	};
}
function GameCanvas({ mode }) {
	const canvasRef = useRef(null);
	const navigate = useNavigate();
	const [score, setScore] = useState(0);
	const [best, setBest] = useState(0);
	const [fps, setFps] = useState(0);
	const [paused, setPaused] = useState(false);
	const [gameOverSession, setGameOverSession] = useState(null);
	const gameStateRef = useRef({
		cols: 24,
		rows: 24,
		cell: 24,
		snake: [],
		dir: DIRS.right,
		nextDir: DIRS.right,
		food: null,
		rareFood: null,
		box: null,
		particles: [],
		fxTexts: [],
		trailGhosts: [],
		tickAcc: 0,
		tickInterval: 110,
		lastTime: 0,
		interp: 0,
		score: 0,
		alive: true,
		paused: false,
		eatPulse: 0,
		eatenCount: 0,
		rareCount: 0,
		boxesOpened: 0,
		comboCount: 0,
		comboTimer: 0,
		multUntil: 0,
		multValue: 1,
		speedUntil: 0,
		settings: loadSettings(),
		skin: getSkin("cyber"),
		trail: getTrail("none"),
		head: getHead("none"),
		theme: getTheme("cyber-grid"),
		mode,
		timeMs: 0,
		runStart: 0,
		fpsCounter: 0,
		fpsLastTime: 0,
		effectiveFps: 60,
		pendingCoins: 0,
		pendingXp: 0,
		startLevel: 1,
		startXp: 0,
		shownLevelUps: /* @__PURE__ */ new Set(),
		notifiedMissions: /* @__PURE__ */ new Set(),
		maxCombo: 0
	});
	const [levelUps, setLevelUps] = useState([]);
	const [missionToasts, setMissionToasts] = useState([]);
	const pendingBoxRewardsRef = useRef([]);
	const [boxToast, setBoxToast] = useState(null);
	const boxToastQueueRef = useRef([]);
	const notifyMissions = useCallback((s) => {
		const completed = syncDailyDuringRun(dailyUpdater(s));
		for (const m of completed) {
			if (s.notifiedMissions.has(m.id)) continue;
			s.notifiedMissions.add(m.id);
			setMissionToasts((prev) => [...prev, {
				label: m.label,
				coins: m.reward.coins,
				xp: m.reward.xp
			}]);
		}
	}, []);
	const previewAndToastLevelUps = useCallback((s) => {
		const preview = previewLevelUps(s.startLevel, s.startXp, s.pendingXp);
		for (const r of preview.rewards) {
			if (s.shownLevelUps.has(r.level)) continue;
			s.shownLevelUps.add(r.level);
			setLevelUps((prev) => [...prev, r]);
		}
	}, []);
	const init = useCallback(() => {
		const s = gameStateRef.current;
		s.settings = loadSettings();
		s.skin = getSkin(s.settings.skin);
		s.trail = getTrail(s.settings.trail);
		s.head = getHead(s.settings.head);
		s.theme = getTheme(s.settings.theme);
		const canvas = canvasRef.current;
		const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
		const parent = canvas.parentElement;
		const w = parent.clientWidth;
		const h = parent.clientHeight;
		const size = Math.max(0, Math.min(w, h));
		canvas.style.width = size + "px";
		canvas.style.height = size + "px";
		canvas.width = Math.floor(size * dpr);
		canvas.height = Math.floor(size * dpr);
		const cols = 24;
		const rows = 24;
		s.cols = cols;
		s.rows = rows;
		s.cell = canvas.width / cols;
		const cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
		s.snake = [
			{
				x: cx - 2,
				y: cy
			},
			{
				x: cx - 1,
				y: cy
			},
			{
				x: cx,
				y: cy
			}
		];
		s.dir = DIRS.right;
		s.nextDir = DIRS.right;
		s.food = spawnFood(s.snake, cols, rows, "normal");
		s.rareFood = null;
		s.box = null;
		s.particles = [];
		s.fxTexts = [];
		s.trailGhosts = [];
		s.score = 0;
		s.alive = true;
		s.tickInterval = mode === "neon-rush" ? 75 : 110;
		s.eatenCount = 0;
		s.rareCount = 0;
		s.boxesOpened = 0;
		s.comboCount = 0;
		s.comboTimer = 0;
		s.multUntil = 0;
		s.multValue = 1;
		s.speedUntil = 0;
		s.timeMs = 0;
		s.runStart = performance.now();
		s.pendingCoins = 0;
		s.pendingXp = 0;
		s.shownLevelUps = /* @__PURE__ */ new Set();
		s.notifiedMissions = /* @__PURE__ */ new Set();
		s.maxCombo = 0;
		const prog = getProgression();
		s.startLevel = prog.level;
		s.startXp = prog.xp;
		setScore(0);
		setBest(getHighScore(mode));
		setGameOverSession(null);
		pendingBoxRewardsRef.current = [];
		boxToastQueueRef.current = [];
		setBoxToast(null);
		setLevelUps([]);
		setMissionToasts([]);
	}, [mode]);
	useEffect(() => {
		init();
		detectScreenRefreshRate().then((hz) => {
			gameStateRef.current.effectiveFps = getEffectiveFpsLimit(loadSettings().fpsLimit, hz);
		});
		const onResize = () => init();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [init]);
	useEffect(() => {
		const s = gameStateRef.current;
		const turn = (d) => {
			if (mode === "reverse") d = {
				x: -d.x,
				y: -d.y
			};
			if (!opposite(d, s.dir) && !(d.x === s.dir.x && d.y === s.dir.y)) s.nextDir = d;
		};
		const onKey = (e) => {
			const k = e.key.toLowerCase();
			if (k === "arrowup" || k === "w") {
				turn(DIRS.up);
				e.preventDefault();
			} else if (k === "arrowdown" || k === "s") {
				turn(DIRS.down);
				e.preventDefault();
			} else if (k === "arrowleft" || k === "a") {
				turn(DIRS.left);
				e.preventDefault();
			} else if (k === "arrowright" || k === "d") {
				turn(DIRS.right);
				e.preventDefault();
			} else if (k === "p" || k === "escape") setPaused((p) => !p);
			else if (k === " ") setPaused((p) => !p);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [mode]);
	useEffect(() => {
		let sx = 0, sy = 0, active = false;
		const onStart = (e) => {
			const t = e.touches[0];
			sx = t.clientX;
			sy = t.clientY;
			active = true;
		};
		const onMove = (e) => {
			if (!active) return;
			const t = e.touches[0];
			const dx = t.clientX - sx, dy = t.clientY - sy;
			const TH = 22;
			if (Math.abs(dx) < TH && Math.abs(dy) < TH) return;
			const s = gameStateRef.current;
			let d;
			if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? DIRS.right : DIRS.left;
			else d = dy > 0 ? DIRS.down : DIRS.up;
			if (mode === "reverse") d = {
				x: -d.x,
				y: -d.y
			};
			if (!opposite(d, s.dir)) s.nextDir = d;
			sx = t.clientX;
			sy = t.clientY;
			e.preventDefault();
		};
		const onEnd = () => {
			active = false;
		};
		window.addEventListener("touchstart", onStart, { passive: true });
		window.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", onEnd);
		return () => {
			window.removeEventListener("touchstart", onStart);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onEnd);
		};
	}, [mode]);
	useEffect(() => {
		gameStateRef.current.paused = paused || !!gameOverSession;
	}, [paused, gameOverSession]);
	useEffect(() => {
		let raf = 0;
		const ctx = canvasRef.current.getContext("2d", { alpha: true });
		let lastFrameTime = 0;
		const loop = (t) => {
			raf = requestAnimationFrame(loop);
			const s = gameStateRef.current;
			const fpsLimit = s.settings.fpsLimit === "auto" ? s.effectiveFps : s.settings.fpsLimit;
			if (fpsLimit) {
				const minInterval = 1e3 / fpsLimit;
				const elapsed = t - lastFrameTime;
				if (elapsed < minInterval - .5) return;
				lastFrameTime = t - elapsed % minInterval;
			} else lastFrameTime = t;
			if (!s.lastTime) s.lastTime = t;
			const dt = Math.min(32, t - s.lastTime);
			s.lastTime = t;
			s.timeMs += dt;
			s.fpsCounter++;
			if (!s.fpsLastTime) s.fpsLastTime = t;
			if (t - s.fpsLastTime >= 1e3) {
				setFps(s.fpsCounter);
				s.fpsCounter = 0;
				s.fpsLastTime = t;
			}
			if (!s.paused && s.alive) {
				s.tickAcc += dt;
				const interval = s.speedUntil > s.timeMs ? Math.max(40, s.tickInterval * .65) : s.tickInterval;
				while (s.tickAcc >= interval) {
					s.tickAcc -= interval;
					step(s);
					if (!s.alive) {
						handleGameOver(s);
						break;
					}
				}
				s.interp = Math.min(1, s.tickAcc / interval);
				if (s.trail.id !== "none" && s.snake.length) {
					const head = s.snake[s.snake.length - 1];
					const hx = head.x + s.dir.x * s.interp;
					const hy = head.y + s.dir.y * s.interp;
					spawnTrailGhost(s.trailGhosts, hx, hy);
				}
				if (s.comboTimer > 0) {
					s.comboTimer -= dt;
					if (s.comboTimer <= 0) s.comboCount = 0;
				}
				if (s.multUntil > 0 && s.timeMs > s.multUntil) {
					s.multUntil = 0;
					s.multValue = 1;
				}
				for (const p of s.particles) {
					p.x += p.vx * (dt / 16);
					p.y += p.vy * (dt / 16);
					p.vx *= .96;
					p.vy *= .96;
					p.life -= dt;
				}
				s.particles = s.particles.filter((p) => p.life > 0);
				for (const ft of s.fxTexts) {
					ft.y += ft.vy * (dt / 16);
					ft.life -= dt;
				}
				s.fxTexts = s.fxTexts.filter((ft) => ft.life > 0);
				for (const g of s.trailGhosts) g.life -= dt;
				s.trailGhosts = s.trailGhosts.filter((g) => g.life > 0);
				if (s.eatPulse > 0) s.eatPulse = Math.max(0, s.eatPulse - dt);
			}
			render(ctx, s);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [mode]);
	function handleGameOver(s) {
		const wasNew = s.score > getHighScore(s.mode);
		setHighScore(s.mode, s.score);
		syncDailyDuringRun(dailyUpdater(s));
		const claimedMissions = claimAllCompletedDaily();
		const survivalMs = performance.now() - s.runStart;
		const survivalXp = Math.floor(survivalMs / 1e3) * 2;
		const endCoins = Math.max(1, Math.floor(s.score / 5));
		const totalXp = s.pendingXp + survivalXp + 25;
		const xpResult = addXp(totalXp);
		addCoinsTracked(s.pendingCoins + endCoins);
		for (const box of pendingBoxRewardsRef.current) applyBoxReward(box);
		const m = getMissions();
		updateMissions({
			gamesPlayed: m.gamesPlayed + 1,
			foodEaten: m.foodEaten + s.eatenCount,
			totalScore: m.totalScore + s.score,
			bestScore: Math.max(m.bestScore, s.score)
		});
		const st = getStats();
		saveStats({
			...st,
			highestScore: Math.max(st.highestScore, s.score),
			longestSnake: Math.max(st.longestSnake, s.snake.length),
			totalGames: st.totalGames + 1,
			totalSurvivalMs: st.totalSurvivalMs + survivalMs
		});
		const achievements = checkAchievements();
		if (s.settings.sound) sfx.over(s.settings.soundVolume);
		if (s.settings.haptics) haptic([
			40,
			30,
			90
		]);
		const preview = previewLevelUps(s.startLevel, s.startXp, s.pendingXp);
		const session = {
			mode: s.mode,
			score: s.score,
			best: Math.max(getHighScore(s.mode), s.score),
			isNewRecord: wasNew,
			coinsEarned: s.pendingCoins + endCoins + preview.rewards.reduce((a, r) => a + r.coins, 0),
			xpEarned: totalXp,
			fruitsEaten: s.eatenCount,
			rareFruits: s.rareCount,
			boxesOpened: s.boxesOpened,
			survivalMs,
			snakeLength: s.snake.length,
			maxCombo: s.maxCombo,
			playedAt: Date.now(),
			rewards: {
				coinsFromFruit: s.pendingCoins,
				coinsFromEnd: endCoins,
				coinsFromLevelUps: preview.rewards.reduce((a, r) => a + r.coins, 0),
				xpEarned: totalXp,
				levelUps: preview.rewards.length ? preview.rewards : xpResult.rewards,
				boxRewards: [...pendingBoxRewardsRef.current],
				missionsCompleted: claimedMissions.map((m) => ({
					label: m.label,
					coins: m.reward.coins,
					xp: m.reward.xp
				})),
				achievementsUnlocked: achievements.map((a) => a.label)
			}
		};
		saveLastSession(session);
		setGameOverSession(session);
	}
	function step(s) {
		s.dir = s.nextDir;
		const head = s.snake[s.snake.length - 1];
		let nx = head.x + s.dir.x;
		let ny = head.y + s.dir.y;
		if (s.settings.wallWrap) {
			nx = (nx + s.cols) % s.cols;
			ny = (ny + s.rows) % s.rows;
		} else if (nx < 0 || ny < 0 || nx >= s.cols || ny >= s.rows) {
			s.alive = false;
			return;
		}
		const ateFood = !!(s.food && nx === s.food.x && ny === s.food.y);
		const ateRare = !!(s.rareFood && nx === s.rareFood.x && ny === s.rareFood.y);
		const ateBox = !!(s.box && nx === s.box.x && ny === s.box.y);
		const grow = ateFood || ateRare;
		const cmpEnd = grow ? 0 : 1;
		for (let i = cmpEnd; i < s.snake.length; i++) if (s.snake[i].x === nx && s.snake[i].y === ny) {
			s.alive = false;
			return;
		}
		s.snake.push({
			x: nx,
			y: ny
		});
		if (!grow && !ateBox) s.snake.shift();
		if (ateBox) s.snake.shift();
		if (grow || ateBox) {
			const kind = ateBox ? "box" : ateRare ? s.rareFood.kind : "normal";
			if (kind === "box") {
				s.box = null;
				s.boxesOpened += 1;
				const reward = rollMysteryBoxReward();
				const st = getStats();
				saveStats({
					...st,
					mysteryBoxes: st.mysteryBoxes + 1
				});
				pendingBoxRewardsRef.current.push(reward);
				boxToastQueueRef.current.push(reward);
				if (boxToastQueueRef.current.length === 1) setBoxToast(reward);
				burstParticles(s, nx, ny, "#fde047", 36);
				if (s.settings.sound) sfx.rare(s.settings.soundVolume);
				if (s.settings.haptics) haptic([
					8,
					12,
					32
				]);
				s.fxTexts.push({
					x: (nx + .5) * s.cell,
					y: (ny + .2) * s.cell,
					text: "BOX!",
					life: 900,
					max: 900,
					color: "#fde047",
					vy: -.6
				});
				notifyMissions(s);
			} else {
				const r = fruitReward(kind);
				const modeMul = s.mode === "neon-rush" ? 2 : 1;
				s.comboCount += 1;
				s.maxCombo = Math.max(s.maxCombo, s.comboCount);
				s.comboTimer = 2400;
				const comboMul = 1 + Math.min(2, (s.comboCount - 1) * .1);
				const mult = modeMul * comboMul * (s.multValue || 1);
				const earnedScore = Math.round(r.score * mult);
				s.score += earnedScore;
				s.eatenCount += 1;
				if (kind !== "normal") s.rareCount += 1;
				if (kind === "rainbow") {
					s.multUntil = s.timeMs + 3e4;
					s.multValue = 2;
				}
				if (kind === "energy") s.speedUntil = s.timeMs + 5e3;
				if (r.coins) s.pendingCoins += r.coins;
				if (r.xp) {
					s.pendingXp += r.xp;
					previewAndToastLevelUps(s);
				}
				setScore(s.score);
				const col = fruitColor(kind);
				burstParticles(s, nx, ny, col.glow, kind === "legendary" ? 50 : kind === "diamond" ? 36 : kind === "normal" ? 14 : 24);
				s.eatPulse = 220;
				if (s.settings.sound) (kind === "normal" ? sfx.eat : sfx.rare)(s.settings.soundVolume);
				if (s.settings.haptics) haptic(kind === "normal" ? 14 : [
					8,
					14,
					28
				]);
				if (kind === "normal") s.food = spawnFood(s.snake, s.cols, s.rows, "normal");
				else s.rareFood = null;
				if (!s.rareFood && Math.random() < .22) s.rareFood = spawnFood(s.snake, s.cols, s.rows, pickRareKind());
				if (!s.box && Math.random() < .04) {
					const p = spawnFood(s.snake, s.cols, s.rows, "normal");
					s.box = {
						x: p.x,
						y: p.y,
						born: performance.now()
					};
				}
				s.fxTexts.push({
					x: (nx + .5) * s.cell,
					y: (ny + .2) * s.cell,
					text: `+${earnedScore}${comboMul > 1.05 ? ` x${comboMul.toFixed(1)}` : ""}`,
					life: 700,
					max: 700,
					color: col.main,
					vy: -.55
				});
				if (s.mode === "classic") s.tickInterval = Math.max(70, 110 - Math.floor(s.score / 8) * 2);
				else if (s.mode === "neon-rush") s.tickInterval = Math.max(50, 75 - Math.floor(s.score / 10));
				patchStats({
					totalFruits: getStats().totalFruits + 1,
					totalRare: getStats().totalRare + (ateRare ? 1 : 0)
				});
				notifyMissions(s);
			}
		}
	}
	function burstParticles(s, gx, gy, color, count) {
		if (s.settings.particles === "off") return;
		const density = s.settings.particles === "low" ? .4 : s.settings.particles === "medium" ? .75 : 1;
		const n = Math.round(count * density);
		const cx = (gx + .5) * s.cell;
		const cy = (gy + .5) * s.cell;
		for (let i = 0; i < n; i++) {
			const a = Math.random() * Math.PI * 2;
			const sp = 1 + Math.random() * 3.5;
			s.particles.push({
				x: cx,
				y: cy,
				vx: Math.cos(a) * sp,
				vy: Math.sin(a) * sp,
				life: 380 + Math.random() * 260,
				max: 640,
				color,
				size: 1.4 + Math.random() * 2.6
			});
		}
	}
	function spawnFood(snake, cols, rows, kind) {
		const taken = new Set(snake.map((p) => p.x + "," + p.y));
		let x = 0, y = 0;
		for (let i = 0; i < 200; i++) {
			x = Math.floor(Math.random() * cols);
			y = Math.floor(Math.random() * rows);
			if (!taken.has(x + "," + y)) break;
		}
		return {
			x,
			y,
			kind,
			hue: Math.random() * 360,
			born: performance.now()
		};
	}
	function render(ctx, s) {
		const W = ctx.canvas.width, H = ctx.canvas.height;
		ctx.clearRect(0, 0, W, H);
		const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? .35 : 1;
		const th = s.theme;
		const tMs = s.timeMs;
		let hA = th.hueA, hB = th.hueB, hC = th.hueC;
		if (s.settings.background) {
			if (th.id === "aurora") {
				hA += Math.sin(tMs / 2500) * 15;
				hB += Math.cos(tMs / 3e3) * 12;
				hC += Math.sin(tMs / 2e3) * 10;
			} else if (th.id === "synthwave") {
				hA += Math.sin(tMs / 4e3) * 8;
				hB += Math.cos(tMs / 5e3) * 10;
			}
		}
		const g = ctx.createRadialGradient(W / 2, H / 2, W * .05, W / 2, H / 2, W * .8);
		g.addColorStop(0, `hsla(${hA}, 70%, 10%, 0.95)`);
		g.addColorStop(.6, `hsla(${hB}, 80%, 5%, 0.98)`);
		g.addColorStop(1, `hsla(${hC}, 70%, 2%, 1)`);
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, W, H);
		if (s.settings.grid) {
			ctx.strokeStyle = "rgba(125, 249, 255, 0.07)";
			ctx.lineWidth = Math.max(1, s.cell * .03);
			ctx.beginPath();
			for (let i = 1; i < s.cols; i++) {
				const x = i * s.cell;
				ctx.moveTo(x, 0);
				ctx.lineTo(x, H);
			}
			for (let j = 1; j < s.rows; j++) {
				const y = j * s.cell;
				ctx.moveTo(0, y);
				ctx.lineTo(W, y);
			}
			ctx.stroke();
		}
		ctx.strokeStyle = th.accent + "73";
		ctx.lineWidth = Math.max(2, s.cell * .08);
		ctx.shadowColor = th.accent;
		ctx.shadowBlur = 18 * blurMult;
		ctx.strokeRect(1, 1, W - 2, H - 2);
		ctx.shadowBlur = 0;
		if (s.box) drawBox(ctx, s, s.box);
		drawTrailGhosts(ctx, s.trail, s.trailGhosts, s.cell, tMs, blurMult);
		const tNow = s.timeMs;
		drawFood(ctx, s, s.food, tNow);
		if (s.rareFood) drawFood(ctx, s, s.rareFood, tNow);
		drawSnake(ctx, s);
		for (const p of s.particles) {
			ctx.globalAlpha = Math.max(0, p.life / p.max);
			ctx.fillStyle = p.color;
			ctx.shadowColor = p.color;
			ctx.shadowBlur = 12 * blurMult;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.font = `bold ${Math.round(s.cell * .55)}px ui-sans-serif, system-ui`;
		ctx.textAlign = "center";
		for (const ft of s.fxTexts) {
			ctx.globalAlpha = ft.life / ft.max;
			ctx.fillStyle = ft.color;
			ctx.shadowColor = ft.color;
			ctx.shadowBlur = 10 * blurMult;
			ctx.fillText(ft.text, ft.x, ft.y);
		}
		ctx.globalAlpha = 1;
		ctx.shadowBlur = 0;
	}
	function drawFood(ctx, s, f, tNow) {
		if (!f) return;
		const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? .35 : 1;
		const rare = f.kind !== "normal";
		const { main, glow } = fruitColor(f.kind);
		const cx = (f.x + .5) * s.cell;
		const cy = (f.y + .5) * s.cell;
		const pulse = .5 + .5 * Math.sin((tNow - f.born) / (rare ? 180 : 260));
		const baseR = f.kind === "legendary" ? .48 : f.kind === "diamond" ? .44 : rare ? .4 : .32;
		const r = s.cell * baseR * (.92 + pulse * .12);
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(tNow / (rare ? 600 : 1200) % (Math.PI * 2));
		ctx.shadowColor = glow;
		ctx.shadowBlur = (f.kind === "legendary" ? 44 : rare ? 30 : 16) * blurMult;
		const grd = ctx.createRadialGradient(0, 0, r * .1, 0, 0, r);
		grd.addColorStop(0, "#ffffff");
		grd.addColorStop(.4, main);
		grd.addColorStop(1, glow);
		ctx.fillStyle = grd;
		if (f.kind === "diamond" || f.kind === "rainbow") {
			ctx.beginPath();
			ctx.moveTo(0, -r);
			ctx.lineTo(r, 0);
			ctx.lineTo(0, r);
			ctx.lineTo(-r, 0);
			ctx.closePath();
			ctx.fill();
		} else if (f.kind === "legendary") {
			ctx.beginPath();
			for (let i = 0; i < 10; i++) {
				const a = i / 10 * Math.PI * 2 - Math.PI / 2;
				const rr = i % 2 === 0 ? r : r * .5;
				ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
			}
			ctx.closePath();
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.arc(0, 0, r, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
		ctx.shadowBlur = 0;
	}
	function drawBox(ctx, s, b) {
		const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? .35 : 1;
		const cx = (b.x + .5) * s.cell;
		const cy = (b.y + .5) * s.cell;
		const pulse = .5 + .5 * Math.sin((performance.now() - b.born) / 220);
		const r = s.cell * .42 * (.95 + pulse * .1);
		ctx.save();
		ctx.translate(cx, cy);
		ctx.rotate(performance.now() / 1500 % (Math.PI * 2));
		ctx.shadowColor = "#fde047";
		ctx.shadowBlur = 28 * blurMult;
		const grd = ctx.createLinearGradient(-r, -r, r, r);
		grd.addColorStop(0, "#fde047");
		grd.addColorStop(.5, "#ff9551");
		grd.addColorStop(1, "#ff5ec4");
		ctx.fillStyle = grd;
		ctx.fillRect(-r, -r, r * 2, r * 2);
		ctx.strokeStyle = "rgba(255,255,255,0.9)";
		ctx.lineWidth = Math.max(1, s.cell * .05);
		ctx.strokeRect(-r, -r, r * 2, r * 2);
		ctx.beginPath();
		ctx.moveTo(-r, 0);
		ctx.lineTo(r, 0);
		ctx.moveTo(0, -r);
		ctx.lineTo(0, r);
		ctx.stroke();
		ctx.restore();
		ctx.shadowBlur = 0;
	}
	function drawSnake(ctx, s) {
		const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? .35 : 1;
		const interp = s.alive && !s.paused ? s.interp : 0;
		const segs = s.snake;
		const points = [];
		for (let i = 0; i < segs.length; i++) {
			const cur = segs[i];
			let x = cur.x, y = cur.y;
			if (i === segs.length - 1) {
				x = cur.x + s.dir.x * interp;
				y = cur.y + s.dir.y * interp;
			} else {
				const nxt = segs[i + 1];
				const dx = nxt.x - cur.x, dy = nxt.y - cur.y;
				if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
					x = cur.x + dx * interp;
					y = cur.y + dy * interp;
				}
			}
			points.push({
				x: (x + .5) * s.cell,
				y: (y + .5) * s.cell
			});
		}
		const skin = s.skin;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle = skin.glow;
		ctx.shadowColor = skin.glow;
		ctx.shadowBlur = 24 * blurMult;
		ctx.lineWidth = s.cell * .85;
		strokePath(ctx, points, s.cell);
		ctx.shadowBlur = 10 * blurMult;
		ctx.strokeStyle = skin.body;
		ctx.lineWidth = s.cell * .66;
		strokePath(ctx, points, s.cell);
		ctx.shadowBlur = 0;
		ctx.strokeStyle = "rgba(255,255,255,0.35)";
		ctx.lineWidth = s.cell * .18;
		strokePath(ctx, points, s.cell);
		const head = points[points.length - 1];
		const r = s.cell * .42;
		ctx.shadowColor = skin.glow;
		ctx.shadowBlur = 20 * blurMult;
		const hg = ctx.createRadialGradient(head.x - r * .3, head.y - r * .3, r * .1, head.x, head.y, r);
		hg.addColorStop(0, "#ffffff");
		hg.addColorStop(.4, skin.head);
		hg.addColorStop(1, skin.body);
		ctx.fillStyle = hg;
		ctx.beginPath();
		ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
		ctx.fill();
		ctx.shadowBlur = 0;
		const dir = s.dir;
		const perp = {
			x: -dir.y,
			y: dir.x
		};
		const eyeOff = r * .35;
		const eyeR = r * .18;
		const blinking = Math.sin(s.timeMs / 1700) > .95 ? .15 : 1;
		for (const sgn of [-1, 1]) {
			const ex = head.x + perp.x * eyeOff * sgn + dir.x * r * .25;
			const ey = head.y + perp.y * eyeOff * sgn + dir.y * r * .25;
			ctx.fillStyle = "#0b0420";
			ctx.beginPath();
			ctx.ellipse(ex, ey, eyeR, eyeR * blinking, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.arc(ex + dir.x * eyeR * .3, ey + dir.y * eyeR * .3, eyeR * .4 * blinking, 0, Math.PI * 2);
			ctx.fill();
		}
		drawHeadEffect(ctx, s, head, r, blurMult);
	}
	function drawHeadEffect(ctx, s, head, r, blurMult) {
		const h = s.head;
		if (h.kind === "none") return;
		ctx.save();
		ctx.shadowColor = h.color;
		ctx.shadowBlur = 20 * blurMult;
		if (h.kind === "halo") {
			ctx.strokeStyle = h.color;
			ctx.lineWidth = Math.max(1.5, s.cell * .06);
			ctx.beginPath();
			ctx.ellipse(head.x, head.y - r * .9, r * .85, r * .3, 0, 0, Math.PI * 2);
			ctx.stroke();
		} else if (h.kind === "crown") {
			ctx.fillStyle = h.color;
			const y = head.y - r * 1.1;
			ctx.beginPath();
			ctx.moveTo(head.x - r * .7, y);
			ctx.lineTo(head.x - r * .4, y - r * .6);
			ctx.lineTo(head.x - r * .15, y - r * .15);
			ctx.lineTo(head.x, y - r * .7);
			ctx.lineTo(head.x + r * .15, y - r * .15);
			ctx.lineTo(head.x + r * .4, y - r * .6);
			ctx.lineTo(head.x + r * .7, y);
			ctx.closePath();
			ctx.fill();
		} else if (h.kind === "core") {
			const grd = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 1.4);
			grd.addColorStop(0, h.color + "ff");
			grd.addColorStop(1, "transparent");
			ctx.fillStyle = grd;
			ctx.beginPath();
			ctx.arc(head.x, head.y, r * 1.4, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}
	function strokePath(ctx, pts, cell) {
		if (pts.length < 2) return;
		ctx.beginPath();
		ctx.moveTo(pts[0].x, pts[0].y);
		for (let i = 1; i < pts.length; i++) {
			const p = pts[i];
			const prev = pts[i - 1];
			if (Math.hypot(p.x - prev.x, p.y - prev.y) > cell * 2.2) ctx.moveTo(p.x, p.y);
			else ctx.lineTo(p.x, p.y);
		}
		ctx.stroke();
	}
	const dismissBoxToast = useCallback(() => {
		boxToastQueueRef.current = boxToastQueueRef.current.slice(1);
		setBoxToast(boxToastQueueRef.current[0] ?? null);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative flex flex-col items-center justify-center w-full h-full max-h-[100dvh] py-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "w-full max-w-[min(95vw,900px)] flex items-center justify-between px-2 py-1 shrink-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: () => navigate({ to: "/" }),
							className: "neon-btn neon-btn-hover !px-3 !py-2 text-xs",
							"aria-label": "Back",
							children: "←"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-xl px-3 py-1.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Score"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-lg font-bold neon-text leading-none",
								children: score
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-xl px-3 py-1.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "Best"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-lg font-bold text-foreground leading-none",
								children: best
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-xl px-3 py-1.5 min-w-[52px] text-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-widest text-muted-foreground",
								children: "FPS"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-lg font-bold text-cyan-400 leading-none",
								children: fps
							})]
						})
					]
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setPaused((p) => !p),
					className: "neon-btn neon-btn-hover !px-3 !py-2 text-xs",
					"aria-label": "Pause",
					children: paused ? "▶" : "❚❚"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative aspect-square shrink-0",
				style: { width: "min(95vw, 85dvh, 900px)" },
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl overflow-hidden neon-panel" }),
					/* @__PURE__ */ jsx("div", {
						className: "relative w-full h-full p-1.5 flex items-center justify-center",
						children: /* @__PURE__ */ jsx("canvas", {
							ref: canvasRef,
							className: "rounded-xl touch-none select-none"
						})
					}),
					paused && !gameOverSession && /* @__PURE__ */ jsx("div", {
						className: "absolute inset-0 rounded-2xl flex items-center justify-center bg-background/60 backdrop-blur-md animate-fade-up",
						children: /* @__PURE__ */ jsxs("div", {
							className: "text-center space-y-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-3xl font-bold neon-text animate-title-glow",
								children: "PAUSED"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3 justify-center",
								children: [/* @__PURE__ */ jsx("button", {
									className: "neon-btn neon-btn-hover",
									onClick: () => setPaused(false),
									children: "Resume"
								}), /* @__PURE__ */ jsx("button", {
									className: "neon-btn neon-btn-hover",
									onClick: () => init(),
									children: "Restart"
								})]
							})]
						})
					}),
					gameOverSession && /* @__PURE__ */ jsx(GameOverStats, {
						session: gameOverSession,
						onPlayAgain: () => init()
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-[11px] text-muted-foreground tracking-widest uppercase mt-2 opacity-70 shrink-0",
				children: "Swipe to steer · WASD / Arrows"
			}),
			/* @__PURE__ */ jsx(LevelUpToast, {
				queue: levelUps,
				onConsume: () => setLevelUps((q) => q.slice(1))
			}),
			/* @__PURE__ */ jsx(MissionCompleteToast, {
				queue: missionToasts,
				onConsume: () => setMissionToasts((q) => q.slice(1))
			}),
			boxToast && !gameOverSession && /* @__PURE__ */ jsx(MysteryBoxToast, {
				reward: boxToast,
				onDone: dismissBoxToast
			})
		]
	});
}
//#endregion
//#region src/routes/play.tsx?tsr-split=component
function Play() {
	const { mode } = Route.useSearch();
	return /* @__PURE__ */ jsxs("main", {
		className: "fixed inset-0 overflow-hidden overscroll-none touch-none flex items-center justify-center",
		children: [/* @__PURE__ */ jsx(NeonBackground, { intensity: .6 }), /* @__PURE__ */ jsx(GameCanvas, { mode })]
	});
}
//#endregion
export { Play as component };

import { C as saveDaily, D as todayKey, T as saveStats, g as getStats, h as getProgression, l as getDaily, n as addCoinsTracked, r as addXp } from "./settings-CjfHWlzJ.js";
//#region src/lib/snake/dailyMissions.ts
var POOL = [
	{
		label: "Eat 25 fruits",
		metric: "fruits",
		target: 25,
		reward: {
			coins: 75,
			xp: 100
		}
	},
	{
		label: "Eat 100 fruits",
		metric: "fruits",
		target: 100,
		reward: {
			coins: 200,
			xp: 300
		}
	},
	{
		label: "Reach score 100",
		metric: "scoreThisRun",
		target: 100,
		reward: {
			coins: 150,
			xp: 200
		}
	},
	{
		label: "Reach score 500",
		metric: "scoreThisRun",
		target: 500,
		reward: {
			coins: 500,
			xp: 700
		}
	},
	{
		label: "Survive 2 minutes",
		metric: "survivalMs",
		target: 12e4,
		reward: {
			coins: 200,
			xp: 250
		}
	},
	{
		label: "Survive 5 minutes",
		metric: "survivalMs",
		target: 3e5,
		reward: {
			coins: 500,
			xp: 600
		}
	},
	{
		label: "Collect 3 rare fruits",
		metric: "rare",
		target: 3,
		reward: {
			coins: 250,
			xp: 300,
			box: true
		}
	},
	{
		label: "Open 1 mystery box",
		metric: "boxes",
		target: 1,
		reward: {
			coins: 200,
			xp: 250
		}
	},
	{
		label: "Play 3 matches",
		metric: "games",
		target: 3,
		reward: {
			coins: 100,
			xp: 150
		}
	},
	{
		label: "Reach combo x5",
		metric: "combo",
		target: 5,
		reward: {
			coins: 150,
			xp: 200
		}
	}
];
function pickThree(level) {
	const out = [];
	const indices = /* @__PURE__ */ new Set();
	while (indices.size < 3) indices.add(Math.floor(Math.random() * POOL.length));
	for (const i of indices) {
		const base = POOL[i];
		const scale = 1 + Math.min(2, level / 60);
		const target = Math.round(base.target * scale);
		const coins = Math.round(base.reward.coins * scale);
		const xp = Math.round(base.reward.xp * scale);
		out.push({
			id: `${todayKey()}-${i}`,
			label: base.label,
			metric: base.metric,
			target,
			progress: 0,
			claimed: false,
			reward: {
				coins,
				xp,
				box: base.reward.box
			}
		});
	}
	return out;
}
function ensureDaily() {
	const today = todayKey();
	const cur = getDaily();
	if (cur && cur.date === today) return cur;
	const fresh = {
		date: today,
		missions: pickThree(getProgression().level)
	};
	saveDaily(fresh);
	return fresh;
}
/** Update daily mission progress during a live run; returns missions that just reached their target. */
function syncDailyDuringRun(updater) {
	const d = ensureDaily();
	const completed = [];
	let changed = false;
	for (const m of d.missions) {
		if (m.claimed) continue;
		const next = Math.max(m.progress, Math.min(m.target, updater(m)));
		if (next !== m.progress) {
			m.progress = next;
			changed = true;
			if (m.progress >= m.target) completed.push({ ...m });
		}
	}
	if (changed) saveDaily(d);
	return completed;
}
function claimAllCompletedDaily() {
	const d = ensureDaily();
	const claimed = [];
	for (const m of d.missions) {
		if (m.claimed || m.progress < m.target) continue;
		const result = claimDaily(m.id);
		if (result) claimed.push(result);
	}
	return claimed;
}
function claimDaily(id) {
	const d = ensureDaily();
	const m = d.missions.find((x) => x.id === id);
	if (!m || m.claimed || m.progress < m.target) return null;
	m.claimed = true;
	if (m.reward.coins) addCoinsTracked(m.reward.coins);
	if (m.reward.xp) addXp(m.reward.xp);
	saveDaily(d);
	const s = getStats();
	saveStats({
		...s,
		missionsCompleted: s.missionsCompleted + 1,
		mysteryBoxes: s.mysteryBoxes + (m.reward.box ? 1 : 0)
	});
	return m;
}
function nextDailyResetMs() {
	const now = /* @__PURE__ */ new Date();
	return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1) - now.getTime();
}
//#endregion
export { syncDailyDuringRun as a, nextDailyResetMs as i, claimDaily as n, ensureDaily as r, claimAllCompletedDaily as t };

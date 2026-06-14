import { f as getMissions, j as NeonBackground } from "./settings-CjfHWlzJ.js";
import { i as nextDailyResetMs, n as claimDaily, r as ensureDaily } from "./dailyMissions-pEkP6oH8.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/missions.tsx?tsr-split=component
var MISSIONS = [
	{
		id: "eat-25",
		label: "Eat 25 foods",
		target: 25,
		metric: "foodEaten"
	},
	{
		id: "eat-100",
		label: "Eat 100 foods",
		target: 100,
		metric: "foodEaten"
	},
	{
		id: "play-5",
		label: "Play 5 games",
		target: 5,
		metric: "gamesPlayed"
	},
	{
		id: "play-25",
		label: "Play 25 games",
		target: 25,
		metric: "gamesPlayed"
	},
	{
		id: "best-20",
		label: "Reach score 20",
		target: 20,
		metric: "bestScore"
	},
	{
		id: "best-50",
		label: "Reach score 50",
		target: 50,
		metric: "bestScore"
	},
	{
		id: "total-500",
		label: "Total score 500",
		target: 500,
		metric: "totalScore"
	}
];
function MissionsPage() {
	const [m, setM] = useState(getMissions());
	const [daily, setDaily] = useState(null);
	const [tick, setTick] = useState(0);
	useEffect(() => {
		setM(getMissions());
		setDaily(ensureDaily());
		const i = setInterval(() => setTick((t) => t + 1), 6e4);
		return () => clearInterval(i);
	}, []);
	const refresh = () => {
		setDaily(ensureDaily());
		setM(getMissions());
	};
	const reset = nextDailyResetMs();
	const h = Math.floor(reset / 36e5);
	const mn = Math.floor(reset % 36e5 / 6e4);
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen px-5 py-8",
		children: [/* @__PURE__ */ jsx(NeonBackground, { intensity: .5 }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-md mx-auto space-y-5 animate-fade-up",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "neon-btn neon-btn-hover !px-3 !py-2 text-xs",
							children: "←"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold neon-text",
							children: "Missions"
						}),
						/* @__PURE__ */ jsx("div", { className: "w-9" })
					]
				}),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground",
						children: [
							"Daily · Resets in ",
							h,
							"h ",
							mn,
							"m"
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "text-[10px] text-muted-foreground",
						children: tick ? "" : ""
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: daily?.missions.map((dm) => {
						const pct = Math.round(dm.progress / dm.target * 100);
						const ready = dm.progress >= dm.target && !dm.claimed;
						return /* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-2xl p-4",
							style: dm.claimed ? { opacity: .55 } : void 0,
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold",
										children: dm.label
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-[10px] text-muted-foreground",
										children: [
											"◇",
											dm.reward.coins,
											" · ",
											dm.reward.xp,
											"xp",
											dm.reward.box ? " · Box" : ""
										]
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "h-2 rounded-full overflow-hidden bg-white/5",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-full rounded-full transition-all",
										style: {
											width: `${Math.min(100, pct)}%`,
											background: dm.claimed ? "linear-gradient(90deg,#39ff88,#22d3ee)" : ready ? "linear-gradient(90deg,#fde047,#ff5ec4)" : "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
											boxShadow: "0 0 14px rgba(125,249,255,.55)"
										}
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mt-2",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "text-xs text-muted-foreground",
											children: [
												Math.min(dm.progress, dm.target),
												" / ",
												dm.target
											]
										}),
										ready && /* @__PURE__ */ jsx("button", {
											onClick: () => {
												claimDaily(dm.id);
												refresh();
											},
											className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs",
											children: "Claim"
										}),
										dm.claimed && /* @__PURE__ */ jsx("div", {
											className: "text-xs text-green-300 uppercase tracking-widest",
											children: "Claimed"
										})
									]
								})
							]
						}, dm.id);
					})
				})] }),
				/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mt-2",
					children: "Lifetime"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "space-y-3",
					children: MISSIONS.map((mn) => {
						const cur = Math.min(mn.target, m[mn.metric] || 0);
						const pct = Math.round(cur / mn.target * 100);
						const done = cur >= mn.target;
						return /* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-2xl p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-semibold",
									children: mn.label
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs text-muted-foreground",
									children: [
										cur,
										"/",
										mn.target
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 rounded-full overflow-hidden bg-white/5",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full transition-all",
									style: {
										width: `${pct}%`,
										background: done ? "linear-gradient(90deg,#39ff88,#22d3ee)" : "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
										boxShadow: "0 0 14px rgba(125,249,255,.55)"
									}
								})
							})]
						}, mn.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { MissionsPage as component };

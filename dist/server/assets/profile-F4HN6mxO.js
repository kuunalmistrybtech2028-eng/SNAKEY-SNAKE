import { c as getCompletedAchievements, g as getStats, h as getProgression, j as NeonBackground, m as getOwnedSkins, p as getOwned, s as getCoins } from "./settings-CjfHWlzJ.js";
import { t as XpBar } from "./XpBar-n5PjWJK-.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/profile.tsx?tsr-split=component
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "neon-panel rounded-xl px-3 py-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-[9px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "text-lg font-bold neon-text leading-tight",
			children: value
		})]
	});
}
function fmtTime(ms) {
	const s = Math.round(ms / 1e3);
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const sec = s % 60;
	if (h) return `${h}h ${m}m`;
	if (m) return `${m}m ${sec}s`;
	return `${sec}s`;
}
function ProfilePage() {
	const [data, setData] = useState({
		stats: getStats(),
		prog: getProgression(),
		coins: 0,
		skins: 0,
		owned: getOwned(),
		ach: 0
	});
	useEffect(() => {
		setData({
			stats: getStats(),
			prog: getProgression(),
			coins: getCoins(),
			skins: getOwnedSkins().length,
			owned: getOwned(),
			ach: getCompletedAchievements().length
		});
	}, []);
	const { stats, prog, coins, skins, owned, ach } = data;
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
							children: "Profile"
						}),
						/* @__PURE__ */ jsx("div", { className: "w-9" })
					]
				}),
				/* @__PURE__ */ jsx(XpBar, {}),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "General"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							label: "Level",
							value: prog.level
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Total XP",
							value: prog.totalXp
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Coins",
							value: `◇ ${coins}`
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "Gameplay"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							label: "Best Score",
							value: stats.highestScore
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Longest Snake",
							value: stats.longestSnake
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Fruits Eaten",
							value: stats.totalFruits
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Rare Fruits",
							value: stats.totalRare
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Games Played",
							value: stats.totalGames
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Survival Time",
							value: fmtTime(stats.totalSurvivalMs)
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "Progression"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							label: "Achievements",
							value: ach
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Missions Done",
							value: stats.missionsCompleted
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Login Streak",
							value: stats.loginStreak
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Mystery Boxes",
							value: stats.mysteryBoxes
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "Collection"
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ jsx(Stat, {
							label: "Skins",
							value: skins
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Trails",
							value: owned.trails.length - 1
						}),
						/* @__PURE__ */ jsx(Stat, {
							label: "Themes",
							value: owned.themes.length
						})
					]
				})] })
			]
		})]
	});
}
//#endregion
export { ProfilePage as component };

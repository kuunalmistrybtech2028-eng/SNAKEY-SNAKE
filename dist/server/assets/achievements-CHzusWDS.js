import { c as getCompletedAchievements, j as NeonBackground } from "./settings-CjfHWlzJ.js";
import { n as checkAchievements, t as ACHIEVEMENTS } from "./achievements-MlWpzmg1.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/achievements.tsx?tsr-split=component
function AchPage() {
	const [done, setDone] = useState([]);
	useEffect(() => {
		checkAchievements();
		setDone(getCompletedAchievements());
	}, []);
	const groups = useMemo(() => {
		const g = {};
		for (const a of ACHIEVEMENTS) (g[a.category] ||= []).push(a);
		return g;
	}, []);
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen px-5 py-8",
		children: [/* @__PURE__ */ jsx(NeonBackground, { intensity: .5 }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-md mx-auto space-y-5 animate-fade-up",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "neon-btn neon-btn-hover !px-3 !py-2 text-xs",
						children: "←"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold neon-text",
						children: "Achievements"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-xs text-muted-foreground",
						children: [
							done.length,
							"/",
							ACHIEVEMENTS.length
						]
					})
				]
			}), Object.entries(groups).map(([cat, items]) => /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
				className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
				children: cat
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				children: items.map((a) => {
					const unlocked = done.includes(a.id);
					return /* @__PURE__ */ jsxs("div", {
						className: "neon-panel rounded-2xl p-3 flex items-center gap-3",
						style: unlocked ? {
							borderColor: "rgba(57,255,136,.5)",
							boxShadow: "0 0 18px rgba(57,255,136,.25)"
						} : void 0,
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
								style: {
									background: unlocked ? "linear-gradient(135deg,#22d3ee,#39ff88)" : "rgba(255,255,255,.06)",
									color: unlocked ? "#0b0420" : "#888"
								},
								children: unlocked ? "✓" : "◇"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold truncate",
									children: a.label
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground truncate",
									children: a.desc
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-right shrink-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[10px] uppercase text-muted-foreground",
									children: "Reward"
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs font-bold",
									children: [
										"◇",
										a.reward.coins,
										a.reward.xp ? ` · ${a.reward.xp}xp` : ""
									]
								})]
							})
						]
					}, a.id);
				})
			})] }, cat))]
		})]
	});
}
//#endregion
export { AchPage as component };

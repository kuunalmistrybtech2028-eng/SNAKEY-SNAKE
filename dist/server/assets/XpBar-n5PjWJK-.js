import { A as xpForLevel, h as getProgression } from "./settings-CjfHWlzJ.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/snake/XpBar.tsx
function XpBar({ refresh = 0 }) {
	const [p, setP] = useState({
		level: 1,
		xp: 0,
		totalXp: 0
	});
	useEffect(() => {
		setP(getProgression());
	}, [refresh]);
	const need = xpForLevel(p.level);
	const pct = Math.min(100, Math.round(p.xp / need * 100));
	return /* @__PURE__ */ jsxs("div", {
		className: "neon-panel rounded-2xl px-4 py-2.5 w-full",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-[10px] uppercase tracking-[0.4em] text-muted-foreground",
				children: "Level"
			}), /* @__PURE__ */ jsxs("div", {
				className: "text-xs text-muted-foreground",
				children: [
					p.xp,
					" / ",
					need,
					" XP"
				]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 mt-1",
			children: [/* @__PURE__ */ jsx("div", {
				className: "text-2xl font-extrabold neon-text leading-none",
				children: p.level
			}), /* @__PURE__ */ jsx("div", {
				className: "flex-1 h-2 rounded-full overflow-hidden bg-white/5",
				children: /* @__PURE__ */ jsx("div", {
					className: "h-full rounded-full transition-all duration-700",
					style: {
						width: `${pct}%`,
						background: "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
						boxShadow: "0 0 12px rgba(125,249,255,.55)"
					}
				})
			})]
		})]
	});
}
//#endregion
export { XpBar as t };

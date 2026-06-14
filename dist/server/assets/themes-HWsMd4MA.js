import { i as buyCosmetic, j as NeonBackground, k as useSettings, p as getOwned, s as getCoins, t as addCoins } from "./settings-CjfHWlzJ.js";
import { n as THEMES } from "./cosmetics-DmwcBj5z.js";
import { n as sfx } from "./audio-BNzA2mo5.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/themes.tsx?tsr-split=component
function ThemesPage() {
	const [s, set] = useSettings();
	const [coins, setCoins] = useState(0);
	const [owned, setOwned] = useState(getOwned());
	const refresh = () => {
		setCoins(getCoins());
		setOwned(getOwned());
	};
	useEffect(() => {
		refresh();
	}, []);
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen px-5 py-8",
		children: [/* @__PURE__ */ jsx(NeonBackground, {
			intensity: .5,
			theme: s.theme
		}), /* @__PURE__ */ jsxs("div", {
			className: "max-w-5xl mx-auto space-y-5 animate-fade-up",
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
							className: "text-3xl font-bold neon-text drop-shadow-lg",
							children: "✨ Themes ✨"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
							children: ["◇ ", coins]
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Choose an eye-catching theme to customize your playground!"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
					children: THEMES.map((t) => {
						const o = owned.themes.includes(t.id);
						const eq = s.theme === t.id;
						return /* @__PURE__ */ jsxs("div", {
							className: "group relative neon-panel rounded-2xl p-4 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer duration-300",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-full aspect-square rounded-xl mb-3 overflow-hidden relative",
									style: {
										background: `radial-gradient(circle at 30% 30%, hsla(${t.hueA},70%,40%,.7), hsla(${t.hueB},70%,18%,.9) 50%, hsla(${t.hueC},70%,6%,1))`,
										boxShadow: `inset 0 0 0 2px ${t.accent}66, 0 0 24px ${t.accent}55`
									},
									children: /* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 animate-pulse",
										style: { background: `radial-gradient(circle at 60% 60%, ${t.accent}22, transparent 70%)` }
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold mb-1 truncate",
									children: t.name
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[11px] text-muted-foreground uppercase tracking-wider mb-3 font-semibold",
									children: t.price === 0 ? "🎁 Free" : `◇ ${t.price}`
								}),
								o ? /* @__PURE__ */ jsx("button", {
									onClick: () => {
										set({ theme: t.id });
										sfx.click(s.soundVolume);
									},
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full font-semibold transition-all duration-200",
									style: eq ? {
										background: "linear-gradient(90deg,#22d3ee44,#a78bfa44)",
										boxShadow: `0 0 12px ${t.accent}88, inset 0 0 8px ${t.accent}44`
									} : { boxShadow: `0 0 8px ${t.accent}55` },
									children: eq ? "⚡ Equipped" : "Equip"
								}) : /* @__PURE__ */ jsx("button", {
									onClick: () => {
										if (getCoins() >= t.price) {
											addCoins(-t.price);
											buyCosmetic("themes", t.id);
											refresh();
											sfx.rare(s.soundVolume);
										}
									},
									disabled: coins < t.price,
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200",
									style: coins >= t.price ? { boxShadow: `0 0 12px ${t.accent}77` } : void 0,
									children: "Unlock"
								})
							]
						}, t.id);
					})
				})
			]
		})]
	});
}
//#endregion
export { ThemesPage as component };

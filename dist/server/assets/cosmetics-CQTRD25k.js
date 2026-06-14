import { i as buyCosmetic, j as NeonBackground, k as useSettings, p as getOwned, s as getCoins, t as addCoins } from "./settings-CjfHWlzJ.js";
import { r as TRAILS, t as HEADS } from "./cosmetics-DmwcBj5z.js";
import { n as sfx } from "./audio-BNzA2mo5.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/cosmetics.tsx?tsr-split=component
function CosmPage() {
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
							children: "Cosmetics"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
							children: ["◇ ", coins]
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "Trails"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3",
					children: TRAILS.map((t) => {
						const o = owned.trails.includes(t.id);
						const eq = s.trail === t.id;
						return /* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-2xl p-4 flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-full h-10 rounded-lg mb-2 flex items-center justify-center",
									style: {
										background: `linear-gradient(90deg, transparent, ${t.color}, ${t.secondary}, transparent)`,
										boxShadow: `0 0 18px ${t.color}66`
									}
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold",
									children: t.name
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-muted-foreground uppercase tracking-widest mb-2",
									children: t.price === 0 ? "Free" : `◇ ${t.price}`
								}),
								o ? /* @__PURE__ */ jsx("button", {
									onClick: () => {
										set({ trail: t.id });
										sfx.click(s.soundVolume);
									},
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full",
									style: eq ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : void 0,
									children: eq ? "Equipped" : "Equip"
								}) : /* @__PURE__ */ jsx("button", {
									onClick: () => {
										if (getCoins() >= t.price) {
											addCoins(-t.price);
											buyCosmetic("trails", t.id);
											refresh();
											sfx.rare(s.soundVolume);
										}
									},
									disabled: coins < t.price,
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40",
									children: "Unlock"
								})
							]
						}, t.id);
					})
				})] }),
				/* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2",
					children: "Head Effects"
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3",
					children: HEADS.map((h) => {
						const o = owned.heads.includes(h.id);
						const eq = s.head === h.id;
						return /* @__PURE__ */ jsxs("div", {
							className: "neon-panel rounded-2xl p-4 flex flex-col items-center text-center",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "w-16 h-16 rounded-full mb-2",
									style: {
										background: `radial-gradient(circle at 30% 30%, #fff, ${h.color} 40%, transparent 75%)`,
										boxShadow: `0 0 24px ${h.color}88`
									}
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-sm font-bold",
									children: h.name
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-muted-foreground uppercase tracking-widest mb-2",
									children: h.price === 0 ? "Free" : `◇ ${h.price}`
								}),
								o ? /* @__PURE__ */ jsx("button", {
									onClick: () => {
										set({ head: h.id });
										sfx.click(s.soundVolume);
									},
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full",
									style: eq ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : void 0,
									children: eq ? "Equipped" : "Equip"
								}) : /* @__PURE__ */ jsx("button", {
									onClick: () => {
										if (getCoins() >= h.price) {
											addCoins(-h.price);
											buyCosmetic("heads", h.id);
											refresh();
											sfx.rare(s.soundVolume);
										}
									},
									disabled: coins < h.price,
									className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40",
									children: "Unlock"
								})
							]
						}, h.id);
					})
				})] })
			]
		})]
	});
}
//#endregion
export { CosmPage as component };

import { a as buySkin, j as NeonBackground, k as useSettings, m as getOwnedSkins, s as getCoins, t as addCoins } from "./settings-CjfHWlzJ.js";
import { n as sfx } from "./audio-BNzA2mo5.js";
import { t as SKINS } from "./skins-Dlwzes_v.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/skins.tsx?tsr-split=component
function SkinsPage() {
	const [s, set] = useSettings();
	const [coins, setCoins] = useState(0);
	const [owned, setOwned] = useState([]);
	useEffect(() => {
		setCoins(getCoins());
		setOwned(getOwnedSkins());
	}, []);
	const refresh = () => {
		setCoins(getCoins());
		setOwned(getOwnedSkins());
	};
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
						children: "Skins"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
						children: ["◇ ", coins]
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-3",
				children: SKINS.map((sk) => {
					const isOwned = owned.includes(sk.id);
					const isEquipped = s.skin === sk.id;
					return /* @__PURE__ */ jsxs("div", {
						className: "neon-panel rounded-2xl p-4 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-20 h-20 rounded-full mb-3",
								style: {
									background: `radial-gradient(circle at 30% 30%, #fff, ${sk.head} 30%, ${sk.body} 60%, transparent 75%)`,
									boxShadow: `0 0 30px ${sk.glow}88, 0 0 60px ${sk.trail}55`
								}
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-sm font-bold",
								children: sk.name
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[10px] text-muted-foreground uppercase tracking-widest mb-3",
								children: sk.price === 0 ? "Free" : `◇ ${sk.price}`
							}),
							isOwned ? /* @__PURE__ */ jsx("button", {
								onClick: () => {
									set({ skin: sk.id });
									sfx.click(s.soundVolume);
								},
								className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full",
								style: isEquipped ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : void 0,
								children: isEquipped ? "Equipped" : "Equip"
							}) : /* @__PURE__ */ jsx("button", {
								onClick: () => {
									if (getCoins() >= sk.price) {
										addCoins(-sk.price);
										buySkin(sk.id);
										refresh();
										sfx.rare(s.soundVolume);
									}
								},
								disabled: coins < sk.price,
								className: "neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40",
								children: "Unlock"
							})
						]
					}, sk.id);
				})
			})]
		})]
	});
}
//#endregion
export { SkinsPage as component };

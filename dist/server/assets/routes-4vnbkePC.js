import { D as todayKey, T as saveStats, d as getLogin, g as getStats, h as getProgression, i as buyCosmetic, j as NeonBackground, n as addCoinsTracked, r as addXp, s as getCoins, u as getHighScore, v as loadSettings, w as saveLogin } from "./settings-CjfHWlzJ.js";
import { n as checkAchievements } from "./achievements-MlWpzmg1.js";
import { n as sfx } from "./audio-BNzA2mo5.js";
import { t as getLastSession } from "./runSession-CFxS0atv.js";
import { t as XpBar } from "./XpBar-n5PjWJK-.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/lib/snake/loginRewards.ts
var LOGIN_CALENDAR = [
	{
		day: 1,
		label: "50 Coins",
		coins: 50,
		xp: 20
	},
	{
		day: 2,
		label: "100 Coins",
		coins: 100,
		xp: 40
	},
	{
		day: 3,
		label: "Rare Boost +XP",
		coins: 50,
		xp: 150
	},
	{
		day: 4,
		label: "150 Coins",
		coins: 150,
		xp: 60
	},
	{
		day: 5,
		label: "Mystery Box",
		coins: 75,
		xp: 100,
		box: true
	},
	{
		day: 6,
		label: "250 Coins",
		coins: 250,
		xp: 100
	},
	{
		day: 7,
		label: "Lightning Trail",
		coins: 200,
		xp: 200,
		cosmetic: {
			kind: "trails",
			id: "lightning"
		}
	}
];
function yesterdayKey() {
	const d = /* @__PURE__ */ new Date();
	d.setUTCDate(d.getUTCDate() - 1);
	return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}
/**
* Call on app open. Updates streak; if lastDay === yesterday, advance index; if today, no change;
* else reset to day 1. Returns state with claimedToday flag.
*/
function syncLogin() {
	const l = getLogin();
	const today = todayKey();
	if (l.lastDay === today) return l;
	if (l.lastDay === yesterdayKey()) l.index = (l.index + 1) % 7;
	else l.index = 0;
	l.lastDay = today;
	l.claimedToday = false;
	saveLogin(l);
	const s = getStats();
	const newStreak = l.index === 0 && l.lastDay !== null ? 1 : s.loginStreak + 1;
	saveStats({
		...s,
		loginStreak: newStreak,
		bestLoginStreak: Math.max(s.bestLoginStreak, newStreak)
	});
	return l;
}
function claimLoginReward() {
	const l = getLogin();
	if (l.claimedToday) return null;
	const r = LOGIN_CALENDAR[l.index];
	if (r.coins) addCoinsTracked(r.coins);
	if (r.xp) addXp(r.xp);
	if (r.cosmetic) buyCosmetic(r.cosmetic.kind, r.cosmetic.id);
	if (r.box) {
		const s = getStats();
		saveStats({
			...s,
			mysteryBoxes: s.mysteryBoxes + 1
		});
	}
	l.claimedToday = true;
	saveLogin(l);
	return r;
}
//#endregion
//#region src/components/snake/DailyLoginModal.tsx
function DailyLoginModal() {
	const [minimized, setMinimized] = useState(false);
	const [open, setOpen] = useState(false);
	const [state, setState] = useState(null);
	const [claimed, setClaimed] = useState(null);
	useEffect(() => {
		const l = syncLogin();
		setState(l);
		if (!l.claimedToday) setOpen(true);
	}, []);
	if (!open || !state) return null;
	const todayReward = LOGIN_CALENDAR[state.index];
	const handleClaim = () => {
		const r = claimLoginReward();
		if (r) {
			setClaimed(r.label);
			setTimeout(() => setMinimized(true), 600);
		}
	};
	if (minimized) return /* @__PURE__ */ jsx("button", {
		onClick: () => setMinimized(false),
		className: "fixed bottom-4 right-4 z-[55] neon-panel rounded-full px-4 py-2 text-xs font-semibold animate-fade-up",
		style: { boxShadow: "0 0 20px rgba(125,249,255,.35)" },
		children: "✓ Daily Reward Claimed"
	});
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-md animate-fade-up",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ jsxs("div", {
			className: "neon-panel rounded-3xl p-5 w-full max-w-md m-3",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[10px] tracking-[0.5em] uppercase text-muted-foreground",
						children: "Daily Reward"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xl font-bold neon-text mt-1",
						children: "Welcome Back!"
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-7 gap-1.5 mt-4",
					children: LOGIN_CALENDAR.map((r, i) => {
						const isToday = i === state.index;
						const past = i < state.index;
						return /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl p-2 text-center border",
							style: {
								borderColor: isToday ? "#7df9ff" : past ? "rgba(57,255,136,.4)" : "rgba(255,255,255,.08)",
								background: isToday ? "linear-gradient(180deg, rgba(125,249,255,.18), rgba(167,139,250,.18))" : past ? "rgba(57,255,136,.08)" : "rgba(255,255,255,.03)",
								boxShadow: isToday ? "0 0 16px rgba(125,249,255,.4)" : void 0
							},
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-[9px] uppercase text-muted-foreground",
								children: ["D", r.day]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] font-semibold mt-0.5 leading-tight",
								children: r.label.split(" ")[0]
							})]
						}, i);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 neon-panel rounded-2xl p-4 text-center",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-[10px] uppercase tracking-widest text-muted-foreground",
							children: ["Today · Day ", state.index + 1]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-lg font-bold neon-text mt-1",
							children: todayReward.label
						}),
						claimed ? /* @__PURE__ */ jsx("div", {
							className: "mt-3 text-sm text-green-300 animate-fade-up",
							children: "Claimed! Minimizing…"
						}) : /* @__PURE__ */ jsx("button", {
							className: "neon-btn neon-btn-hover mt-3 w-full",
							onClick: handleClaim,
							children: "Claim Reward"
						})
					]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => setOpen(false),
					className: "mt-3 w-full text-xs text-muted-foreground uppercase tracking-widest",
					children: "Close"
				})
			]
		})
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	const [coins, setCoins] = useState(0);
	const [best, setBest] = useState(0);
	const [level, setLevel] = useState(1);
	const [mounted, setMounted] = useState(false);
	const [lastRun, setLastRun] = useState(null);
	useEffect(() => {
		setCoins(getCoins());
		setBest(Math.max(getHighScore("classic"), getHighScore("neon-rush"), getHighScore("reverse")));
		setLevel(getProgression().level);
		setLastRun(getLastSession());
		loadSettings();
		checkAchievements();
		requestAnimationFrame(() => setMounted(true));
	}, []);
	const onClick = () => {
		const s = loadSettings();
		if (s.sound) sfx.click(s.soundVolume);
	};
	return /* @__PURE__ */ jsxs("main", {
		className: "relative min-h-screen flex flex-col items-center justify-between px-5 py-6 overflow-hidden",
		children: [
			/* @__PURE__ */ jsx(NeonBackground, {}),
			/* @__PURE__ */ jsxs("header", {
				className: "w-full max-w-md space-y-2",
				style: {
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(-20px)",
					transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)"
				},
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground uppercase tracking-widest",
									children: "Best "
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold neon-text",
									children: best
								})]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/profile",
								className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground uppercase tracking-widest",
									children: "Lv "
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold neon-text",
									children: level
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "neon-panel rounded-xl px-3 py-1.5 text-xs",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground uppercase tracking-widest",
									children: "Coins "
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-bold text-foreground",
									children: ["◇ ", coins]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsx(XpBar, {}),
					lastRun && /* @__PURE__ */ jsxs("div", {
						className: "neon-panel rounded-xl px-3 py-2 text-[10px] text-muted-foreground",
						children: [
							"Last run · ",
							/* @__PURE__ */ jsx("span", {
								className: "neon-text font-bold",
								children: lastRun.score
							}),
							" pts · +",
							lastRun.coinsEarned,
							" coins · ",
							lastRun.fruitsEaten,
							" fruits"
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "flex-1 flex flex-col items-center justify-center text-center mt-2 mb-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "text-[10px] tracking-[0.6em] text-muted-foreground uppercase mb-3",
						style: {
							opacity: mounted ? 1 : 0,
							transform: mounted ? "translateY(0)" : "translateY(15px)",
							transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.15s"
						},
						children: "Premium Neon Arcade"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-6xl sm:text-7xl font-black neon-text animate-title-glow leading-none",
						style: {
							fontFamily: "ui-sans-serif, system-ui",
							opacity: mounted ? 1 : 0,
							transform: mounted ? "scale(1)" : "scale(0.8)",
							transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.2s"
						},
						children: "SNAKEY"
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-5xl sm:text-6xl font-black animate-title-glow leading-none mt-1",
						style: {
							background: "linear-gradient(90deg,#7df9ff,#a78bfa,#ff5ec4,#fde047)",
							backgroundSize: "300% 100%",
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							color: "transparent",
							animation: "title-glow 3.2s ease-in-out infinite, intro-name-shimmer 4s ease-in-out infinite",
							opacity: mounted ? 1 : 0,
							transform: mounted ? "scale(1)" : "scale(0.8)",
							transition: "opacity 0.9s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.3s"
						},
						children: "SNAKE"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6 animate-float-y",
						style: {
							opacity: mounted ? .9 : 0,
							transition: "opacity 1s ease",
							transitionDelay: "0.5s"
						},
						children: /* @__PURE__ */ jsx("div", {
							className: "w-28 h-28 rounded-full animate-neon-pulse",
							style: {
								background: "radial-gradient(circle at 35% 30%, #fff, #7df9ff 30%, #a78bfa 60%, transparent 75%)",
								boxShadow: "0 0 60px rgba(125,249,255,.45), 0 0 120px rgba(167,139,250,.35)"
							}
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4",
						style: {
							opacity: mounted ? 1 : 0,
							transform: mounted ? "translateY(0)" : "translateY(10px)",
							transition: "all 0.8s ease",
							transitionDelay: "0.7s"
						},
						children: /* @__PURE__ */ jsxs("div", {
							className: "owner-badge",
							children: [/* @__PURE__ */ jsx("svg", {
								width: "10",
								height: "10",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								children: /* @__PURE__ */ jsx("path", { d: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" })
							}), "By Kuunal Mistry"]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("nav", {
				className: "w-full max-w-md grid grid-cols-1 gap-3",
				style: {
					opacity: mounted ? 1 : 0,
					transform: mounted ? "translateY(0)" : "translateY(30px)",
					transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
					transitionDelay: "0.4s"
				},
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/play",
						search: { mode: "classic" },
						onClick,
						className: "neon-btn neon-btn-hover text-base",
						children: "▶ Classic"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/play",
							search: { mode: "neon-rush" },
							onClick,
							className: "neon-btn neon-btn-hover text-sm",
							style: {
								borderColor: "rgba(255,94,196,.55)",
								boxShadow: "0 0 20px rgba(255,94,196,.35)"
							},
							children: "⚡ Neon Rush"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/play",
							search: { mode: "reverse" },
							onClick,
							className: "neon-btn neon-btn-hover text-sm",
							style: {
								borderColor: "rgba(167,139,250,.55)",
								boxShadow: "0 0 20px rgba(167,139,250,.35)"
							},
							children: "↺ Reverse"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-4 gap-2 mt-1",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/skins",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Skins"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/cosmetics",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Trails"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/themes",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Themes"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/missions",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Missions"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/achievements",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Awards"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/profile",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Profile"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/settings",
								onClick,
								className: "neon-btn neon-btn-hover !px-2 !py-3 text-[11px]",
								children: "Settings"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "mt-6 flex flex-col items-center gap-2",
				style: {
					opacity: mounted ? 1 : 0,
					transition: "opacity 0.8s ease",
					transitionDelay: "0.6s"
				},
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[10px] tracking-[0.35em] text-muted-foreground uppercase opacity-60",
					children: "Tap · Swipe · WASD · Arrows"
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-[9px] tracking-[0.2em] text-muted-foreground uppercase opacity-40",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Kuunal Mistry · All Rights Reserved"
					]
				})]
			}),
			/* @__PURE__ */ jsx(DailyLoginModal, {})
		]
	});
}
//#endregion
export { Index as component };

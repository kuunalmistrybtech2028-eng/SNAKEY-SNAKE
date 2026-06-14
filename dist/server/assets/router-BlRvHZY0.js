import { t as Route$9 } from "./play-Bkh71OT_.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//#region src/components/snake/IntroSplash.tsx
/**
* Cinematic intro splash — "SNAKEY SNAKE" title with "BY KUUNAL MISTRY" credit.
*/
function IntroSplash({ onComplete }) {
	const canvasRef = useRef(null);
	const [phase, setPhase] = useState("enter");
	const startRef = useRef(0);
	const stableComplete = useCallback(onComplete, [onComplete]);
	useEffect(() => {
		startRef.current = performance.now();
		const t1 = setTimeout(() => setPhase("hold"), 700);
		const t2 = setTimeout(() => setPhase("exit"), 3400);
		const t3 = setTimeout(() => stableComplete(), 4300);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	}, [stableComplete]);
	useEffect(() => {
		const c = canvasRef.current;
		const ctx = c.getContext("2d");
		let raf = 0;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const resize = () => {
			c.width = window.innerWidth * dpr;
			c.height = window.innerHeight * dpr;
			c.style.width = window.innerWidth + "px";
			c.style.height = window.innerHeight + "px";
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);
		const W = () => window.innerWidth;
		const H = () => window.innerHeight;
		const loop = (t) => {
			raf = requestAnimationFrame(loop);
			const w = W(), h = H();
			const elapsed = (t - startRef.current) / 1e3;
			const warp = elapsed < .6 ? elapsed / .6 : elapsed > 3.4 ? Math.max(0, 1 - (elapsed - 3.4) / .9) : 1;
			ctx.clearRect(0, 0, w, h);
			const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * .75);
			bg.addColorStop(0, "#12032a");
			bg.addColorStop(.45, "#06010f");
			bg.addColorStop(1, "#000000");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, w, h);
			ctx.save();
			ctx.translate(w / 2, h * .62);
			const gridScale = 1 + elapsed * .08;
			ctx.scale(gridScale, gridScale);
			ctx.strokeStyle = `rgba(125, 249, 255, ${.06 * warp})`;
			ctx.lineWidth = 1;
			for (let i = -12; i <= 12; i++) {
				ctx.beginPath();
				ctx.moveTo(i * 40, -200);
				ctx.lineTo(i * 40, 200);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(-500, i * 18);
				ctx.lineTo(500, i * 18);
				ctx.stroke();
			}
			ctx.restore();
			for (let i = 0; i < 24; i++) {
				const angle = elapsed * .5 + i / 24 * Math.PI * 2;
				const radius = 120 + Math.sin(elapsed + i) * 40;
				const px = w / 2 + Math.cos(angle) * radius;
				const py = h / 2 + Math.sin(angle) * radius * .45;
				const hue = (195 + i * 14 + elapsed * 40) % 360;
				ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${.12 * warp})`;
				ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
				ctx.shadowBlur = 12;
				ctx.beginPath();
				ctx.arc(px, py, 2 + i % 3, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.shadowBlur = 0;
			const snakeY = h / 2 + 100;
			for (let i = 7; i >= 0; i--) {
				const segTime = elapsed * 5 - i * .14;
				const segX = w / 2 + Math.sin(segTime) * 100;
				const segY = snakeY + Math.cos(segTime * 2) * 10;
				const size = i === 0 ? 7 : 5.5 - i * .35;
				ctx.fillStyle = `rgba(125, 249, 255, ${(.5 + i * .05) * warp})`;
				ctx.shadowColor = "#7df9ff";
				ctx.shadowBlur = 10;
				ctx.beginPath();
				ctx.arc(segX, segY, size, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.shadowBlur = 0;
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden",
		style: {
			opacity: phase === "exit" ? 0 : 1,
			transform: phase === "exit" ? "scale(1.04)" : "scale(1)",
			transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
		},
		children: [
			/* @__PURE__ */ jsx("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 w-full h-full"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative z-10 flex flex-col items-center justify-center gap-3 px-6 text-center",
				children: [
					/* @__PURE__ */ jsxs("h1", {
						className: "intro-game-title-main",
						style: {
							opacity: phase === "enter" ? 0 : 1,
							transform: phase === "enter" ? "scale(0.55) translateY(40px)" : "scale(1) translateY(0)",
							transition: "all 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.15s"
						},
						children: [/* @__PURE__ */ jsx("span", {
							className: "intro-snakey-word",
							children: "SNAKEY"
						}), /* @__PURE__ */ jsx("span", {
							className: "intro-snake-word",
							children: "SNAKE"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "intro-line",
						style: {
							width: phase === "enter" ? "0px" : "240px",
							opacity: phase === "enter" ? 0 : .7,
							transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.55s"
						}
					}),
					/* @__PURE__ */ jsx("p", {
						className: "intro-credit",
						style: {
							opacity: phase === "enter" ? 0 : 1,
							transform: phase === "enter" ? "translateY(24px)" : "translateY(0)",
							transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
							transitionDelay: "0.75s"
						},
						children: "BY KUUNAL MISTRY"
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: stableComplete,
				className: "absolute bottom-8 z-10 text-xs tracking-[0.3em] uppercase opacity-30 hover:opacity-60 transition-opacity text-white/70 cursor-pointer bg-transparent border-none",
				children: "Tap to skip"
			})
		]
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-DHENILMV.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Snakey Snake" },
			{
				name: "description",
				content: "A Classic Snake Game By Kuunal Mistry"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Snakey Snake"
			},
			{
				property: "og:description",
				content: "A Classic Snake Game By Kuunal Mistry"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Snakey Snake"
			},
			{
				name: "twitter:description",
				content: "A Classic Snake Game By Kuunal Mistry"
			},
			{
				property: "og:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/39298eaa-f6de-48f8-96e4-24cfc247bc47"
			},
			{
				name: "twitter:image",
				content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/39298eaa-f6de-48f8-96e4-24cfc247bc47"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	const [showIntro, setShowIntro] = useState(() => {
		if (typeof window === "undefined") return false;
		return !sessionStorage.getItem("snakey_intro_seen");
	});
	const handleIntroComplete = useCallback(() => {
		sessionStorage.setItem("snakey_intro_seen", "1");
		setShowIntro(false);
	}, []);
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [showIntro && /* @__PURE__ */ jsx(IntroSplash, { onComplete: handleIntroComplete }), /* @__PURE__ */ jsx(Outlet, {})]
	});
}
//#endregion
//#region src/routes/themes.tsx
var $$splitComponentImporter$7 = () => import("./themes-HWsMd4MA.js");
var Route$7 = createFileRoute("/themes")({
	head: () => ({ meta: [{ title: "Themes — Snakey Snake" }, {
		name: "description",
		content: "Unlock animated background themes for the playfield."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/skins.tsx
var $$splitComponentImporter$6 = () => import("./skins-0w-xOWH8.js");
var Route$6 = createFileRoute("/skins")({
	head: () => ({ meta: [{ title: "Skins — Snakey Snake" }, {
		name: "description",
		content: "Unlock and equip premium neon snake skins."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/settings.tsx
var $$splitComponentImporter$5 = () => import("./settings-DhXWpoR9.js");
var Route$5 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — Snakey Snake" }, {
		name: "description",
		content: "Tune graphics, FPS, particles, sound, haptics and controls."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$4 = () => import("./profile-F4HN6mxO.js");
var Route$4 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Profile — Snakey Snake" }, {
		name: "description",
		content: "Track your level, achievements and lifetime stats."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/missions.tsx
var $$splitComponentImporter$3 = () => import("./missions-DhYltmg9.js");
var Route$3 = createFileRoute("/missions")({
	head: () => ({ meta: [{ title: "Missions — Snakey Snake" }, {
		name: "description",
		content: "Complete missions to progress and unlock rewards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/cosmetics.tsx
var $$splitComponentImporter$2 = () => import("./cosmetics-CQTRD25k.js");
var Route$2 = createFileRoute("/cosmetics")({
	head: () => ({ meta: [{ title: "Cosmetics — Snakey Snake" }, {
		name: "description",
		content: "Unlock and equip neon trails and head effects."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/achievements.tsx
var $$splitComponentImporter$1 = () => import("./achievements-CHzusWDS.js");
var Route$1 = createFileRoute("/achievements")({
	head: () => ({ meta: [{ title: "Achievements — Snakey Snake" }, {
		name: "description",
		content: "Unlock achievements and claim premium rewards."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-4vnbkePC.js");
var Route = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Snakey Snake — Premium Neon Arcade" },
		{
			name: "description",
			content: "Snakey Snake is a premium neon arcade snake game by Kuunal Mistry. Classic, Neon Rush and Reverse modes, skins, missions, and silky 60/120fps gameplay."
		},
		{
			property: "og:title",
			content: "Snakey Snake — Premium Neon Arcade"
		},
		{
			property: "og:description",
			content: "A premium neon arcade snake game by Kuunal Mistry with silky 60/120fps gameplay, skins and missions."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var ThemesRoute = Route$7.update({
	id: "/themes",
	path: "/themes",
	getParentRoute: () => Route$8
});
var SkinsRoute = Route$6.update({
	id: "/skins",
	path: "/skins",
	getParentRoute: () => Route$8
});
var SettingsRoute = Route$5.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$8
});
var ProfileRoute = Route$4.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$8
});
var PlayRoute = Route$9.update({
	id: "/play",
	path: "/play",
	getParentRoute: () => Route$8
});
var MissionsRoute = Route$3.update({
	id: "/missions",
	path: "/missions",
	getParentRoute: () => Route$8
});
var CosmeticsRoute = Route$2.update({
	id: "/cosmetics",
	path: "/cosmetics",
	getParentRoute: () => Route$8
});
var AchievementsRoute = Route$1.update({
	id: "/achievements",
	path: "/achievements",
	getParentRoute: () => Route$8
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AchievementsRoute,
	CosmeticsRoute,
	MissionsRoute,
	PlayRoute,
	ProfileRoute,
	SettingsRoute,
	SkinsRoute,
	ThemesRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

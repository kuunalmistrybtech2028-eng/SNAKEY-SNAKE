import { S as resetSaveData, _ as importSaveData, j as NeonBackground, k as useSettings, o as exportSaveData } from "./settings-CjfHWlzJ.js";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/settings.tsx?tsr-split=component
function Row({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-sm text-foreground/90",
			children: label
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2",
			children
		})]
	});
}
function Toggle({ value, onChange }) {
	return /* @__PURE__ */ jsx("button", {
		onClick: () => onChange(!value),
		className: "relative w-12 h-7 rounded-full transition-colors",
		style: {
			background: value ? "linear-gradient(90deg,#22d3ee,#a78bfa)" : "rgba(125,249,255,.12)",
			boxShadow: value ? "0 0 18px rgba(125,249,255,.45)" : "inset 0 0 0 1px rgba(125,249,255,.25)"
		},
		"aria-pressed": value,
		children: /* @__PURE__ */ jsx("span", {
			className: "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform",
			style: { transform: value ? "translateX(20px)" : "translateX(0)" }
		})
	});
}
function Seg({ value, options, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex rounded-lg overflow-hidden neon-panel p-0.5",
		children: options.map((o) => /* @__PURE__ */ jsx("button", {
			onClick: () => onChange(o.value),
			className: "px-2.5 py-1 text-xs uppercase tracking-wider transition-colors",
			style: {
				background: value === o.value ? "linear-gradient(90deg,#22d3ee33,#a78bfa33)" : "transparent",
				color: value === o.value ? "#fff" : "rgba(255,255,255,.6)"
			},
			children: o.label
		}, String(o.value)))
	});
}
function Slider({ value, onChange }) {
	return /* @__PURE__ */ jsx("input", {
		type: "range",
		min: 0,
		max: 1,
		step: .05,
		value,
		onChange: (e) => onChange(parseFloat(e.target.value)),
		className: "w-32 accent-cyan-300"
	});
}
function SettingsPage() {
	const [s, set] = useSettings();
	const fileInputRef = useRef(null);
	const handleExport = () => {
		const dataStr = exportSaveData();
		const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
		const exportFileDefaultName = `snakey_snake_backup_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};
	const handleImportClick = () => {
		fileInputRef.current?.click();
	};
	const handleImportFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const result = event.target?.result;
			if (typeof result === "string") if (importSaveData(result)) {
				alert("Backup imported successfully! Game will reload.");
				window.location.reload();
			} else alert("Failed to import save data. Please make sure it is a valid backup file.");
		};
		reader.readAsText(file);
	};
	const handleReset = () => {
		if (confirm("Are you absolutely sure you want to reset all game data? This will clear all coins, levels, unlocked skins, and scores! This cannot be undone.")) {
			resetSaveData();
			alert("All game data has been reset. Game will reload.");
			window.location.reload();
		}
	};
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
							children: "Settings"
						}),
						/* @__PURE__ */ jsx("div", { className: "w-9" })
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-5 py-2",
					children: [
						/* @__PURE__ */ jsx(Row, {
							label: "Grid",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.grid,
								onChange: (v) => set({ grid: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Wall Wrap",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.wallWrap,
								onChange: (v) => set({ wallWrap: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Background Effects",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.background,
								onChange: (v) => set({ background: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Swipe Controls",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.swipe,
								onChange: (v) => set({ swipe: v })
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-5 py-2",
					children: [
						/* @__PURE__ */ jsx(Row, {
							label: "FPS Limit",
							children: /* @__PURE__ */ jsx(Seg, {
								value: s.fpsLimit,
								onChange: (v) => set({ fpsLimit: v }),
								options: [
									{
										label: "Auto",
										value: "auto"
									},
									{
										label: "60",
										value: 60
									},
									{
										label: "90",
										value: 90
									},
									{
										label: "120",
										value: 120
									}
								]
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Graphics",
							children: /* @__PURE__ */ jsx(Seg, {
								value: s.graphics,
								onChange: (v) => set({ graphics: v }),
								options: [
									{
										label: "Low",
										value: "low"
									},
									{
										label: "Med",
										value: "medium"
									},
									{
										label: "High",
										value: "high"
									}
								]
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Particles",
							children: /* @__PURE__ */ jsx(Seg, {
								value: s.particles,
								onChange: (v) => set({ particles: v }),
								options: [
									{
										label: "Off",
										value: "off"
									},
									{
										label: "Low",
										value: "low"
									},
									{
										label: "Med",
										value: "medium"
									},
									{
										label: "High",
										value: "high"
									}
								]
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Performance",
							children: /* @__PURE__ */ jsx(Seg, {
								value: s.performance,
								onChange: (v) => set({ performance: v }),
								options: [
									{
										label: "Battery",
										value: "battery"
									},
									{
										label: "Balanced",
										value: "balanced"
									},
									{
										label: "Max",
										value: "performance"
									}
								]
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-5 py-2",
					children: [
						/* @__PURE__ */ jsx(Row, {
							label: "Sound Effects",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.sound,
								onChange: (v) => set({ sound: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Sound Volume",
							children: /* @__PURE__ */ jsx(Slider, {
								value: s.soundVolume,
								onChange: (v) => set({ soundVolume: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Music",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.music,
								onChange: (v) => set({ music: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Music Volume",
							children: /* @__PURE__ */ jsx(Slider, {
								value: s.musicVolume,
								onChange: (v) => set({ musicVolume: v })
							})
						}),
						/* @__PURE__ */ jsx(Row, {
							label: "Haptic Feedback",
							children: /* @__PURE__ */ jsx(Toggle, {
								value: s.haptics,
								onChange: (v) => set({ haptics: v })
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "neon-panel rounded-2xl px-5 py-4 space-y-4",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-sm font-semibold uppercase tracking-wider text-cyan-400",
							children: "Data Management"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: "Your coins, high scores, levels, unlocked skins, and settings are saved automatically in your browser's local storage."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: handleExport,
								className: "neon-btn text-xs py-2 w-full text-center",
								children: "Export Backup"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleImportClick,
								className: "neon-btn text-xs py-2 w-full text-center",
								children: "Import Backup"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleReset,
							className: "w-full border border-red-500/30 hover:border-red-500/60 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer",
							children: "Reset All Game Data"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "file",
							ref: fileInputRef,
							onChange: handleImportFile,
							accept: ".json",
							className: "hidden"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { SettingsPage as component };

import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { useSettings, exportSaveData, importSaveData, resetSaveData } from "@/lib/snake/settings";
import { useRef } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Snakey Snake" },
      { name: "description", content: "Tune graphics, FPS, particles, sound, haptics and controls." },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
      <div className="text-sm text-foreground/90">{label}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-7 rounded-full transition-colors"
      style={{
        background: value ? "linear-gradient(90deg,#22d3ee,#a78bfa)" : "rgba(125,249,255,.12)",
        boxShadow: value ? "0 0 18px rgba(125,249,255,.45)" : "inset 0 0 0 1px rgba(125,249,255,.25)",
      }}
      aria-pressed={value}
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform"
        style={{ transform: value ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

function Seg<T extends string | number>({ value, options, onChange }: {
  value: T; options: { label: string; value: T }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg overflow-hidden neon-panel p-0.5">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className="px-2.5 py-1 text-xs uppercase tracking-wider transition-colors"
          style={{
            background: value === o.value ? "linear-gradient(90deg,#22d3ee33,#a78bfa33)" : "transparent",
            color: value === o.value ? "#fff" : "rgba(255,255,255,.6)",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range" min={0} max={1} step={0.05} value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-32 accent-cyan-300"
    />
  );
}

function SettingsPage() {
  const [s, set] = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = exportSaveData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `snakey_snake_backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        const ok = importSaveData(result);
        if (ok) {
          alert("Backup imported successfully! Game will reload.");
          window.location.reload();
        } else {
          alert("Failed to import save data. Please make sure it is a valid backup file.");
        }
      }
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

  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Settings</h1>
          <div className="w-9" />
        </div>

        <section className="neon-panel rounded-2xl px-5 py-2">
          <Row label="Grid"><Toggle value={s.grid} onChange={(v) => set({ grid: v })} /></Row>
          <Row label="Wall Wrap"><Toggle value={s.wallWrap} onChange={(v) => set({ wallWrap: v })} /></Row>
          <Row label="Background Effects"><Toggle value={s.background} onChange={(v) => set({ background: v })} /></Row>
          <Row label="Swipe Controls"><Toggle value={s.swipe} onChange={(v) => set({ swipe: v })} /></Row>
        </section>

        <section className="neon-panel rounded-2xl px-5 py-2">
          <Row label="FPS Limit">
            <Seg
              value={s.fpsLimit}
              onChange={(v) => set({ fpsLimit: v })}
              options={[
                { label: "Auto", value: "auto" as const },
                { label: "60", value: 60 as const },
                { label: "90", value: 90 as const },
                { label: "120", value: 120 as const },
              ]}
            />
          </Row>
          <Row label="Graphics">
            <Seg
              value={s.graphics}
              onChange={(v) => set({ graphics: v })}
              options={[
                { label: "Low", value: "low" as const },
                { label: "Med", value: "medium" as const },
                { label: "High", value: "high" as const },
              ]}
            />
          </Row>
          <Row label="Particles">
            <Seg
              value={s.particles}
              onChange={(v) => set({ particles: v })}
              options={[
                { label: "Off", value: "off" as const },
                { label: "Low", value: "low" as const },
                { label: "Med", value: "medium" as const },
                { label: "High", value: "high" as const },
              ]}
            />
          </Row>
          <Row label="Performance">
            <Seg
              value={s.performance}
              onChange={(v) => set({ performance: v })}
              options={[
                { label: "Battery", value: "battery" as const },
                { label: "Balanced", value: "balanced" as const },
                { label: "Max", value: "performance" as const },
              ]}
            />
          </Row>
        </section>

        <section className="neon-panel rounded-2xl px-5 py-2">
          <Row label="Sound Effects"><Toggle value={s.sound} onChange={(v) => set({ sound: v })} /></Row>
          <Row label="Sound Volume"><Slider value={s.soundVolume} onChange={(v) => set({ soundVolume: v })} /></Row>
          <Row label="Music"><Toggle value={s.music} onChange={(v) => set({ music: v })} /></Row>
          <Row label="Music Volume"><Slider value={s.musicVolume} onChange={(v) => set({ musicVolume: v })} /></Row>
          <Row label="Haptic Feedback"><Toggle value={s.haptics} onChange={(v) => set({ haptics: v })} /></Row>
        </section>

        <section className="neon-panel rounded-2xl px-5 py-4 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Data Management</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your coins, high scores, levels, unlocked skins, and settings are saved automatically in your browser's local storage.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleExport} className="neon-btn text-xs py-2 w-full text-center">
              Export Backup
            </button>
            <button onClick={handleImportClick} className="neon-btn text-xs py-2 w-full text-center">
              Import Backup
            </button>
          </div>
          <button onClick={handleReset} className="w-full border border-red-500/30 hover:border-red-500/60 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer">
            Reset All Game Data
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json"
            className="hidden"
          />
        </section>
      </div>
    </main>
  );
}
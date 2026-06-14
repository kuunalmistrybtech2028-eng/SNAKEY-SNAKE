import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { getMissions, type MissionState } from "@/lib/snake/settings";
import { useEffect, useState } from "react";
import { ensureDaily, claimDaily, nextDailyResetMs } from "@/lib/snake/dailyMissions";
import type { DailyState } from "@/lib/snake/settings";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions — Snakey Snake" },
      { name: "description", content: "Complete missions to progress and unlock rewards." },
    ],
  }),
  component: MissionsPage,
});

interface Mission { id: string; label: string; target: number; metric: keyof MissionState }
const MISSIONS: Mission[] = [
  { id: "eat-25", label: "Eat 25 foods", target: 25, metric: "foodEaten" },
  { id: "eat-100", label: "Eat 100 foods", target: 100, metric: "foodEaten" },
  { id: "play-5", label: "Play 5 games", target: 5, metric: "gamesPlayed" },
  { id: "play-25", label: "Play 25 games", target: 25, metric: "gamesPlayed" },
  { id: "best-20", label: "Reach score 20", target: 20, metric: "bestScore" },
  { id: "best-50", label: "Reach score 50", target: 50, metric: "bestScore" },
  { id: "total-500", label: "Total score 500", target: 500, metric: "totalScore" },
];

function MissionsPage() {
  const [m, setM] = useState(getMissions());
  const [daily, setDaily] = useState<DailyState | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setM(getMissions());
    setDaily(ensureDaily());
    const i = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);
  const refresh = () => { setDaily(ensureDaily()); setM(getMissions()); };
  const reset = nextDailyResetMs();
  const h = Math.floor(reset / 3_600_000); const mn = Math.floor((reset % 3_600_000) / 60_000);

  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Missions</h1>
          <div className="w-9" />
        </div>

        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground">Daily · Resets in {h}h {mn}m</div>
            <div className="text-[10px] text-muted-foreground">{tick ? "" : ""}</div>
          </div>
          <div className="space-y-3">
            {daily?.missions.map(dm => {
              const pct = Math.round((dm.progress / dm.target) * 100);
              const ready = dm.progress >= dm.target && !dm.claimed;
              return (
                <div key={dm.id} className="neon-panel rounded-2xl p-4"
                     style={dm.claimed ? { opacity: .55 } : undefined}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-sm font-semibold">{dm.label}</div>
                    <div className="text-[10px] text-muted-foreground">◇{dm.reward.coins} · {dm.reward.xp}xp{dm.reward.box ? " · Box" : ""}</div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-white/5">
                    <div className="h-full rounded-full transition-all"
                         style={{
                           width: `${Math.min(100, pct)}%`,
                           background: dm.claimed ? "linear-gradient(90deg,#39ff88,#22d3ee)"
                             : ready ? "linear-gradient(90deg,#fde047,#ff5ec4)"
                             : "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
                           boxShadow: "0 0 14px rgba(125,249,255,.55)",
                         }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">{Math.min(dm.progress, dm.target)} / {dm.target}</div>
                    {ready && (
                      <button onClick={() => { claimDaily(dm.id); refresh(); }}
                              className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs">Claim</button>
                    )}
                    {dm.claimed && <div className="text-xs text-green-300 uppercase tracking-widest">Claimed</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mt-2">Lifetime</div>
        <div className="space-y-3">
          {MISSIONS.map((mn) => {
            const cur = Math.min(mn.target, (m[mn.metric] as number) || 0);
            const pct = Math.round((cur / mn.target) * 100);
            const done = cur >= mn.target;
            return (
              <div key={mn.id} className="neon-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">{mn.label}</div>
                  <div className="text-xs text-muted-foreground">{cur}/{mn.target}</div>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-white/5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: done
                        ? "linear-gradient(90deg,#39ff88,#22d3ee)"
                        : "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
                      boxShadow: "0 0 14px rgba(125,249,255,.55)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
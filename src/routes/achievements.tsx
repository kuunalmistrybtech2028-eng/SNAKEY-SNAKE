import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { ACHIEVEMENTS, checkAchievements } from "@/lib/snake/achievements";
import { getCompletedAchievements } from "@/lib/snake/settings";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Snakey Snake" },
      { name: "description", content: "Unlock achievements and claim premium rewards." },
    ],
  }),
  component: AchPage,
});

function AchPage() {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    checkAchievements();
    setDone(getCompletedAchievements());
  }, []);
  const groups = useMemo(() => {
    const g: Record<string, typeof ACHIEVEMENTS> = {};
    for (const a of ACHIEVEMENTS) (g[a.category] ||= []).push(a);
    return g;
  }, []);
  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Achievements</h1>
          <div className="text-xs text-muted-foreground">{done.length}/{ACHIEVEMENTS.length}</div>
        </div>
        {Object.entries(groups).map(([cat, items]) => (
          <section key={cat}>
            <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">{cat}</div>
            <div className="space-y-2">
              {items.map(a => {
                const unlocked = done.includes(a.id);
                return (
                  <div key={a.id} className="neon-panel rounded-2xl p-3 flex items-center gap-3"
                       style={unlocked ? { borderColor: "rgba(57,255,136,.5)", boxShadow: "0 0 18px rgba(57,255,136,.25)" } : undefined}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                         style={{
                           background: unlocked ? "linear-gradient(135deg,#22d3ee,#39ff88)" : "rgba(255,255,255,.06)",
                           color: unlocked ? "#0b0420" : "#888",
                         }}>
                      {unlocked ? "✓" : "◇"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{a.label}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{a.desc}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase text-muted-foreground">Reward</div>
                      <div className="text-xs font-bold">◇{a.reward.coins}{a.reward.xp ? ` · ${a.reward.xp}xp` : ""}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
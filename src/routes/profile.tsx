import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { XpBar } from "@/components/snake/XpBar";
import { getStats, getProgression, getCoins, getOwnedSkins, getOwned, getCompletedAchievements } from "@/lib/snake/settings";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Snakey Snake" },
      { name: "description", content: "Track your level, achievements and lifetime stats." },
    ],
  }),
  component: ProfilePage,
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="neon-panel rounded-xl px-3 py-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-lg font-bold neon-text leading-tight">{value}</div>
    </div>
  );
}

function fmtTime(ms: number) {
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function ProfilePage() {
  const [data, setData] = useState({ stats: getStats(), prog: getProgression(), coins: 0, skins: 0, owned: getOwned(), ach: 0 });
  useEffect(() => {
    setData({
      stats: getStats(),
      prog: getProgression(),
      coins: getCoins(),
      skins: getOwnedSkins().length,
      owned: getOwned(),
      ach: getCompletedAchievements().length,
    });
  }, []);
  const { stats, prog, coins, skins, owned, ach } = data;
  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Profile</h1>
          <div className="w-9" />
        </div>
        <XpBar />
        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">General</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Level" value={prog.level} />
            <Stat label="Total XP" value={prog.totalXp} />
            <Stat label="Coins" value={`◇ ${coins}`} />
          </div>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">Gameplay</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Best Score" value={stats.highestScore} />
            <Stat label="Longest Snake" value={stats.longestSnake} />
            <Stat label="Fruits Eaten" value={stats.totalFruits} />
            <Stat label="Rare Fruits" value={stats.totalRare} />
            <Stat label="Games Played" value={stats.totalGames} />
            <Stat label="Survival Time" value={fmtTime(stats.totalSurvivalMs)} />
          </div>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">Progression</div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Achievements" value={ach} />
            <Stat label="Missions Done" value={stats.missionsCompleted} />
            <Stat label="Login Streak" value={stats.loginStreak} />
            <Stat label="Mystery Boxes" value={stats.mysteryBoxes} />
          </div>
        </section>
        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">Collection</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Skins" value={skins} />
            <Stat label="Trails" value={owned.trails.length - 1} />
            <Stat label="Themes" value={owned.themes.length} />
          </div>
        </section>
      </div>
    </main>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { useEffect, useState } from "react";
import { getCoins, getHighScore, loadSettings, getProgression } from "@/lib/snake/settings";
import { getLastSession } from "@/lib/snake/runSession";
import { sfx } from "@/lib/snake/audio";
import { XpBar } from "@/components/snake/XpBar";
import { DailyLoginModal } from "@/components/snake/DailyLoginModal";
import { checkAchievements } from "@/lib/snake/achievements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snakey Snake — Premium Neon Arcade" },
      { name: "description", content: "Snakey Snake is a premium neon arcade snake game by Kuunal Mistry. Classic, Neon Rush and Reverse modes, skins, missions, and silky 60/120fps gameplay." },
      { property: "og:title", content: "Snakey Snake — Premium Neon Arcade" },
      { property: "og:description", content: "A premium neon arcade snake game by Kuunal Mistry with silky 60/120fps gameplay, skins and missions." },
    ],
  }),
  component: Index,
});

function Index() {
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [lastRun, setLastRun] = useState<ReturnType<typeof getLastSession>>(null);

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

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between px-5 py-6 overflow-hidden">
      <NeonBackground />

      <header
        className="w-full max-w-md space-y-2"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="neon-panel rounded-xl px-3 py-1.5 text-xs">
            <span className="text-muted-foreground uppercase tracking-widest">Best </span>
            <span className="font-bold neon-text">{best}</span>
          </div>
          <Link to="/profile" className="neon-panel rounded-xl px-3 py-1.5 text-xs">
            <span className="text-muted-foreground uppercase tracking-widest">Lv </span>
            <span className="font-bold neon-text">{level}</span>
          </Link>
          <div className="neon-panel rounded-xl px-3 py-1.5 text-xs">
            <span className="text-muted-foreground uppercase tracking-widest">Coins </span>
            <span className="font-bold text-foreground">◇ {coins}</span>
          </div>
        </div>
        <XpBar />
        {lastRun && (
          <div className="neon-panel rounded-xl px-3 py-2 text-[10px] text-muted-foreground">
            Last run · <span className="neon-text font-bold">{lastRun.score}</span> pts · +{lastRun.coinsEarned} coins · {lastRun.fruitsEaten} fruits
          </div>
        )}
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center mt-2 mb-4">
        <div
          className="text-[10px] tracking-[0.6em] text-muted-foreground uppercase mb-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.15s",
          }}
        >
          Premium Neon Arcade
        </div>
        <h1
          className="text-6xl sm:text-7xl font-black neon-text animate-title-glow leading-none"
          style={{
            fontFamily: "ui-sans-serif, system-ui",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.8)",
            transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.2s",
          }}
        >
          SNAKEY
        </h1>
        <h1
          className="text-5xl sm:text-6xl font-black animate-title-glow leading-none mt-1"
          style={{
            background: "linear-gradient(90deg,#7df9ff,#a78bfa,#ff5ec4,#fde047)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "title-glow 3.2s ease-in-out infinite, intro-name-shimmer 4s ease-in-out infinite",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "scale(1)" : "scale(0.8)",
            transition: "opacity 0.9s, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.3s",
          }}
        >
          SNAKE
        </h1>

        {/* Glowing orb */}
        <div
          className="mt-6 animate-float-y"
          style={{
            opacity: mounted ? 0.9 : 0,
            transition: "opacity 1s ease",
            transitionDelay: "0.5s",
          }}
        >
          <div className="w-28 h-28 rounded-full animate-neon-pulse" style={{
            background: "radial-gradient(circle at 35% 30%, #fff, #7df9ff 30%, #a78bfa 60%, transparent 75%)",
            boxShadow: "0 0 60px rgba(125,249,255,.45), 0 0 120px rgba(167,139,250,.35)",
          }} />
        </div>

        {/* Owner badge */}
        <div
          className="mt-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.8s ease",
            transitionDelay: "0.7s",
          }}
        >
          <div className="owner-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            By Kuunal Mistry
          </div>
        </div>
      </section>

      <nav
        className="w-full max-w-md grid grid-cols-1 gap-3"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          transitionDelay: "0.4s",
        }}
      >
        <Link to="/play" search={{ mode: "classic" }} onClick={onClick}
          className="neon-btn neon-btn-hover text-base">
          ▶ Classic
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/play" search={{ mode: "neon-rush" }} onClick={onClick}
            className="neon-btn neon-btn-hover text-sm"
            style={{ borderColor: "rgba(255,94,196,.55)", boxShadow: "0 0 20px rgba(255,94,196,.35)" }}>
            ⚡ Neon Rush
          </Link>
          <Link to="/play" search={{ mode: "reverse" }} onClick={onClick}
            className="neon-btn neon-btn-hover text-sm"
            style={{ borderColor: "rgba(167,139,250,.55)", boxShadow: "0 0 20px rgba(167,139,250,.35)" }}>
            ↺ Reverse
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-1">
          <Link to="/skins" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Skins</Link>
          <Link to="/cosmetics" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Trails</Link>
          <Link to="/themes" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Themes</Link>
          <Link to="/missions" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Missions</Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Link to="/achievements" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Awards</Link>
          <Link to="/profile" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Profile</Link>
          <Link to="/settings" onClick={onClick} className="neon-btn neon-btn-hover !px-2 !py-3 text-[11px]">Settings</Link>
        </div>
      </nav>

      <footer
        className="mt-6 flex flex-col items-center gap-2"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease",
          transitionDelay: "0.6s",
        }}
      >
        <div className="text-[10px] tracking-[0.35em] text-muted-foreground uppercase opacity-60">
          Tap · Swipe · WASD · Arrows
        </div>
        <div className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase opacity-40">
          © {new Date().getFullYear()} Kuunal Mistry · All Rights Reserved
        </div>
      </footer>
      <DailyLoginModal />
    </main>
  );
}

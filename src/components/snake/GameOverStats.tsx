import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import type { LastSession } from "@/lib/snake/runSession";

function fmtTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function GameOverStats({
  session,
  onPlayAgain,
}: {
  session: LastSession;
  onPlayAgain: () => void;
}) {
  const { rewards } = session;
  const totalCoins =
    rewards.coinsFromFruit +
    rewards.coinsFromEnd +
    rewards.coinsFromLevelUps +
    rewards.boxRewards.reduce((s, r) => s + (r.kind === "coins" ? (r.amount ?? 0) : 0), 0) +
    rewards.missionsCompleted.reduce((s, m) => s + m.coins, 0);

  return (
    <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-background/85 backdrop-blur-lg animate-fade-up overflow-y-auto">
      <div className="w-full max-w-sm px-5 py-6 space-y-4 my-auto">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground">
            {session.isNewRecord ? "New Record!" : "Run Complete"}
          </div>
          <div className="text-5xl font-extrabold neon-text animate-title-glow mt-1">{session.score}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Best {session.best} · {session.mode.replace("-", " ")}
          </div>
        </div>

        <section className="neon-panel rounded-2xl px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Run Stats</div>
          <StatRow label="Survival" value={fmtTime(session.survivalMs)} />
          <StatRow label="Snake Length" value={session.snakeLength} />
          <StatRow label="Fruits Eaten" value={session.fruitsEaten} />
          <StatRow label="Rare Fruits" value={session.rareFruits} />
          <StatRow label="Mystery Boxes" value={session.boxesOpened} />
          <StatRow label="Max Combo" value={`x${session.maxCombo}`} />
        </section>

        <section className="neon-panel rounded-2xl px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-cyan-400 mb-1">Rewards Collected</div>
          <StatRow label="Total Coins" value={`+${totalCoins}`} />
          <StatRow label="XP Earned" value={`+${rewards.xpEarned}`} />
          {rewards.levelUps.length > 0 && (
            <StatRow label="Level Ups" value={rewards.levelUps.map((l) => `Lv ${l.level}`).join(", ")} />
          )}
          {rewards.boxRewards.length > 0 && (
            <StatRow label="Box Drops" value={rewards.boxRewards.map((b) => b.label).join(", ")} />
          )}
          {rewards.missionsCompleted.length > 0 && (
            <StatRow label="Missions" value={rewards.missionsCompleted.map((m) => m.label).join(", ")} />
          )}
          {rewards.achievementsUnlocked.length > 0 && (
            <StatRow label="Achievements" value={rewards.achievementsUnlocked.join(", ")} />
          )}
        </section>

        <div className="flex flex-col gap-2 pt-1">
          <button className="neon-btn neon-btn-hover w-full" onClick={onPlayAgain}>
            Play Again
          </button>
          <Link to="/" className="neon-btn neon-btn-hover w-full text-center">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Auto-dismiss toast shown during gameplay */
export function PopupToast({
  title,
  subtitle,
  detail,
  accent = "cyan",
  onDone,
  durationMs = 2000,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  accent?: "cyan" | "gold" | "green" | "pink";
  onDone: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [onDone, durationMs]);

  const glow =
    accent === "gold"
      ? "0 0 30px rgba(253,224,71,.55), 0 0 80px rgba(255,94,196,.4)"
      : accent === "green"
        ? "0 0 30px rgba(57,255,136,.45), 0 0 60px rgba(125,249,255,.3)"
        : accent === "pink"
          ? "0 0 30px rgba(255,94,196,.55), 0 0 80px rgba(167,139,250,.4)"
          : "0 0 30px rgba(125,249,255,.55), 0 0 80px rgba(167,139,250,.4)";

  return (
    <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className="neon-panel rounded-2xl px-6 py-3 text-center min-w-[220px]" style={{ boxShadow: glow }}>
        <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">{title}</div>
        {subtitle && <div className="text-2xl font-extrabold neon-text mt-0.5">{subtitle}</div>}
        {detail && <div className="text-xs text-foreground/80 mt-0.5">{detail}</div>}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

interface Reward { level: number; coins: number; box: boolean }

const TOAST_MS = 2000;

export function LevelUpToast({ queue, onConsume }: { queue: Reward[]; onConsume: () => void }) {
  const [show, setShow] = useState<Reward | null>(null);

  useEffect(() => {
    if (!show && queue.length) {
      setShow(queue[0]);
      const t = setTimeout(() => {
        setShow(null);
        onConsume();
      }, TOAST_MS);
      return () => clearTimeout(t);
    }
  }, [queue, show, onConsume]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div
        className="neon-panel rounded-2xl px-6 py-3 text-center"
        style={{ boxShadow: "0 0 30px rgba(125,249,255,.55), 0 0 80px rgba(167,139,250,.4)" }}
      >
        <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Level Up</div>
        <div className="text-3xl font-extrabold neon-text">LV {show.level}</div>
        <div className="text-xs text-foreground/80 mt-0.5">
          +{show.coins} coins{show.box ? " · Mystery Box" : ""}
        </div>
      </div>
    </div>
  );
}

export function MissionCompleteToast({
  queue,
  onConsume,
}: {
  queue: { label: string; coins: number; xp: number }[];
  onConsume: () => void;
}) {
  const [show, setShow] = useState<{ label: string; coins: number; xp: number } | null>(null);

  useEffect(() => {
    if (!show && queue.length) {
      setShow(queue[0]);
      const t = setTimeout(() => {
        setShow(null);
        onConsume();
      }, TOAST_MS);
      return () => clearTimeout(t);
    }
  }, [queue, show, onConsume]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div
        className="neon-panel rounded-2xl px-6 py-3 text-center"
        style={{ boxShadow: "0 0 30px rgba(57,255,136,.45), 0 0 60px rgba(125,249,255,.3)" }}
      >
        <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Mission Complete</div>
        <div className="text-lg font-extrabold neon-text mt-0.5">{show.label}</div>
        <div className="text-xs text-foreground/80 mt-0.5">+{show.coins} coins · +{show.xp} XP</div>
      </div>
    </div>
  );
}

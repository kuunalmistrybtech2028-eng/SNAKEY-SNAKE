import { useEffect } from "react";
import type { BoxReward } from "@/lib/snake/mysteryBox";

const TOAST_MS = 2000;

/** Lightweight 2-second mystery box reveal during gameplay */
export function MysteryBoxToast({ reward, onDone }: { reward: BoxReward; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, TOAST_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div
        className="neon-panel rounded-2xl px-6 py-4 text-center"
        style={{ boxShadow: "0 0 40px rgba(253,224,71,.5), 0 0 120px rgba(255,94,196,.4)" }}
      >
        <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Mystery Box</div>
        <div className="my-2 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-xl animate-neon-pulse"
            style={{
              background: "linear-gradient(135deg,#fde047,#ff9551,#ff5ec4)",
              boxShadow: "0 0 30px rgba(253,224,71,.7)",
            }}
          />
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">You got</div>
        <div className="text-xl font-extrabold neon-text">{reward.label}</div>
      </div>
    </div>
  );
}

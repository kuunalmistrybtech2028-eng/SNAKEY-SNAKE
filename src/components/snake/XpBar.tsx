import { useEffect, useState } from "react";
import { getProgression, xpForLevel } from "@/lib/snake/settings";

export function XpBar({ refresh = 0 }: { refresh?: number }) {
  const [p, setP] = useState({ level: 1, xp: 0, totalXp: 0 });
  useEffect(() => { setP(getProgression()); }, [refresh]);
  const need = xpForLevel(p.level);
  const pct = Math.min(100, Math.round((p.xp / need) * 100));
  return (
    <div className="neon-panel rounded-2xl px-4 py-2.5 w-full">
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Level</div>
        <div className="text-xs text-muted-foreground">{p.xp} / {need} XP</div>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div className="text-2xl font-extrabold neon-text leading-none">{p.level}</div>
        <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#22d3ee,#a78bfa,#ff5ec4)",
              boxShadow: "0 0 12px rgba(125,249,255,.55)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
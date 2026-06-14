import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { THEMES } from "@/lib/snake/cosmetics";
import { buyCosmetic, getCoins, getOwned, useSettings, addCoins } from "@/lib/snake/settings";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/snake/audio";

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { title: "Themes — Snakey Snake" },
      { name: "description", content: "Unlock animated background themes for the playfield." },
    ],
  }),
  component: ThemesPage,
});

function ThemesPage() {
  const [s, set] = useSettings();
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState(getOwned());
  const refresh = () => { setCoins(getCoins()); setOwned(getOwned()); };
  useEffect(() => { refresh(); }, []);
  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} theme={s.theme} />
      <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-3xl font-bold neon-text drop-shadow-lg">✨ Themes ✨</h1>
          <div className="neon-panel rounded-xl px-3 py-1.5 text-xs">◇ {coins}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">Choose an eye-catching theme to customize your playground!</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {THEMES.map(t => {
            const o = owned.themes.includes(t.id);
            const eq = s.theme === t.id;
            return (
              <div 
                key={t.id}
                className="group relative neon-panel rounded-2xl p-4 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer duration-300"
              >
                {/* Animated background preview */}
                <div className="w-full aspect-square rounded-xl mb-3 overflow-hidden relative"
                     style={{
                       background: `radial-gradient(circle at 30% 30%, hsla(${t.hueA},70%,40%,.7), hsla(${t.hueB},70%,18%,.9) 50%, hsla(${t.hueC},70%,6%,1))`,
                       boxShadow: `inset 0 0 0 2px ${t.accent}66, 0 0 24px ${t.accent}55`,
                     }}>
                  {/* Additional visual effects for preview */}
                  <div className="absolute inset-0 animate-pulse" style={{
                    background: `radial-gradient(circle at 60% 60%, ${t.accent}22, transparent 70%)`,
                  }} />
                </div>
                
                <div className="text-sm font-bold mb-1 truncate">{t.name}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 font-semibold">{t.price === 0 ? "🎁 Free" : `◇ ${t.price}`}</div>
                
                {o ? (
                  <button onClick={() => { set({ theme: t.id }); sfx.click(s.soundVolume); }}
                          className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full font-semibold transition-all duration-200"
                          style={eq ? { 
                            background: "linear-gradient(90deg,#22d3ee44,#a78bfa44)",
                            boxShadow: `0 0 12px ${t.accent}88, inset 0 0 8px ${t.accent}44`
                          } : {
                            boxShadow: `0 0 8px ${t.accent}55`
                          }}>
                    {eq ? "⚡ Equipped" : "Equip"}
                  </button>
                ) : (
                  <button onClick={() => {
                            if (getCoins() >= t.price) { addCoins(-t.price); buyCosmetic("themes", t.id); refresh(); sfx.rare(s.soundVolume); }
                          }}
                          disabled={coins < t.price}
                          className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                          style={coins >= t.price ? {
                            boxShadow: `0 0 12px ${t.accent}77`
                          } : undefined}>
                    Unlock
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
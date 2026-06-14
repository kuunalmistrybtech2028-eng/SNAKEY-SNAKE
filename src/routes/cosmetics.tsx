import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { TRAILS, HEADS } from "@/lib/snake/cosmetics";
import { buyCosmetic, getCoins, getOwned, useSettings, addCoins } from "@/lib/snake/settings";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/snake/audio";

export const Route = createFileRoute("/cosmetics")({
  head: () => ({
    meta: [
      { title: "Cosmetics — Snakey Snake" },
      { name: "description", content: "Unlock and equip neon trails and head effects." },
    ],
  }),
  component: CosmPage,
});

function CosmPage() {
  const [s, set] = useSettings();
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState(getOwned());
  const refresh = () => { setCoins(getCoins()); setOwned(getOwned()); };
  useEffect(() => { refresh(); }, []);

  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Cosmetics</h1>
          <div className="neon-panel rounded-xl px-3 py-1.5 text-xs">◇ {coins}</div>
        </div>

        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">Trails</div>
          <div className="grid grid-cols-2 gap-3">
            {TRAILS.map(t => {
              const o = owned.trails.includes(t.id);
              const eq = s.trail === t.id;
              return (
                <div key={t.id} className="neon-panel rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-full h-10 rounded-lg mb-2 flex items-center justify-center"
                       style={{ background: `linear-gradient(90deg, transparent, ${t.color}, ${t.secondary}, transparent)`, boxShadow: `0 0 18px ${t.color}66` }} />
                  <div className="text-sm font-bold">{t.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{t.price === 0 ? "Free" : `◇ ${t.price}`}</div>
                  {o ? (
                    <button onClick={() => { set({ trail: t.id }); sfx.click(s.soundVolume); }}
                            className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full"
                            style={eq ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : undefined}>
                      {eq ? "Equipped" : "Equip"}
                    </button>
                  ) : (
                    <button onClick={() => {
                              if (getCoins() >= t.price) { addCoins(-t.price); buyCosmetic("trails", t.id); refresh(); sfx.rare(s.soundVolume); }
                            }}
                            disabled={coins < t.price}
                            className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40">
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-2">Head Effects</div>
          <div className="grid grid-cols-2 gap-3">
            {HEADS.map(h => {
              const o = owned.heads.includes(h.id);
              const eq = s.head === h.id;
              return (
                <div key={h.id} className="neon-panel rounded-2xl p-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full mb-2"
                       style={{ background: `radial-gradient(circle at 30% 30%, #fff, ${h.color} 40%, transparent 75%)`, boxShadow: `0 0 24px ${h.color}88` }} />
                  <div className="text-sm font-bold">{h.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{h.price === 0 ? "Free" : `◇ ${h.price}`}</div>
                  {o ? (
                    <button onClick={() => { set({ head: h.id }); sfx.click(s.soundVolume); }}
                            className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full"
                            style={eq ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : undefined}>
                      {eq ? "Equipped" : "Equip"}
                    </button>
                  ) : (
                    <button onClick={() => {
                              if (getCoins() >= h.price) { addCoins(-h.price); buyCosmetic("heads", h.id); refresh(); sfx.rare(s.soundVolume); }
                            }}
                            disabled={coins < h.price}
                            className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40">
                      Unlock
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
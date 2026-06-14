import { createFileRoute, Link } from "@tanstack/react-router";
import { NeonBackground } from "@/components/snake/NeonBackground";
import { SKINS } from "@/lib/snake/skins";
import { buySkin, getCoins, getOwnedSkins, useSettings, addCoins } from "@/lib/snake/settings";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/snake/audio";

export const Route = createFileRoute("/skins")({
  head: () => ({
    meta: [
      { title: "Skins — Snakey Snake" },
      { name: "description", content: "Unlock and equip premium neon snake skins." },
    ],
  }),
  component: SkinsPage,
});

function SkinsPage() {
  const [s, set] = useSettings();
  const [coins, setCoins] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  useEffect(() => {
    setCoins(getCoins());
    setOwned(getOwnedSkins());
  }, []);

  const refresh = () => {
    setCoins(getCoins());
    setOwned(getOwnedSkins());
  };

  return (
    <main className="relative min-h-screen px-5 py-8">
      <NeonBackground intensity={0.5} />
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link to="/" className="neon-btn neon-btn-hover !px-3 !py-2 text-xs">←</Link>
          <h1 className="text-2xl font-bold neon-text">Skins</h1>
          <div className="neon-panel rounded-xl px-3 py-1.5 text-xs">◇ {coins}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SKINS.map((sk) => {
            const isOwned = owned.includes(sk.id);
            const isEquipped = s.skin === sk.id;
            return (
              <div key={sk.id} className="neon-panel rounded-2xl p-4 flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-full mb-3"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #fff, ${sk.head} 30%, ${sk.body} 60%, transparent 75%)`,
                    boxShadow: `0 0 30px ${sk.glow}88, 0 0 60px ${sk.trail}55`,
                  }}
                />
                <div className="text-sm font-bold">{sk.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
                  {sk.price === 0 ? "Free" : `◇ ${sk.price}`}
                </div>
                {isOwned ? (
                  <button
                    onClick={() => { set({ skin: sk.id }); sfx.click(s.soundVolume); }}
                    className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full"
                    style={isEquipped ? { background: "linear-gradient(90deg,#22d3ee33,#a78bfa33)" } : undefined}
                  >
                    {isEquipped ? "Equipped" : "Equip"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (getCoins() >= sk.price) {
                        addCoins(-sk.price); buySkin(sk.id); refresh();
                        sfx.rare(s.soundVolume);
                      }
                    }}
                    disabled={coins < sk.price}
                    className="neon-btn neon-btn-hover !px-3 !py-1.5 text-xs w-full disabled:opacity-40"
                  >
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
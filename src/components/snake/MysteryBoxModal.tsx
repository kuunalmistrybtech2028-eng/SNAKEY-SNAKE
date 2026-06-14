import { useEffect, useState } from "react";
import type { BoxReward } from "@/lib/snake/mysteryBox";

export function MysteryBoxModal({ reward, onClose }: { reward: BoxReward; onClose: () => void }) {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 450);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/70 backdrop-blur-md animate-fade-up"
         onClick={onClose}>
      <div className="neon-panel rounded-3xl px-8 py-7 text-center max-w-xs"
           style={{ boxShadow: "0 0 40px rgba(253,224,71,.5), 0 0 120px rgba(255,94,196,.4)" }}>
        <div className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">Mystery Box</div>
        <div className="my-4 flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl animate-neon-pulse"
               style={{
                 background: "linear-gradient(135deg,#fde047,#ff9551,#ff5ec4)",
                 transform: opened ? "scale(1.15) rotate(8deg)" : "scale(1)",
                 transition: "transform 600ms cubic-bezier(.2,.7,.2,1.4)",
                 boxShadow: "0 0 40px rgba(253,224,71,.7), inset 0 0 20px rgba(255,255,255,.4)",
               }} />
        </div>
        {opened && (
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">You got</div>
            <div className="text-2xl font-extrabold neon-text mt-1">{reward.label}</div>
            <button className="neon-btn neon-btn-hover mt-5" onClick={onClose}>Awesome</button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Cinematic intro splash — "SNAKEY SNAKE" title with "BY KUUNAL MISTRY" credit.
 */
export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const startRef = useRef(0);

  const stableComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    startRef.current = performance.now();
    const t1 = setTimeout(() => setPhase("hold"), 700);
    const t2 = setTimeout(() => setPhase("exit"), 3400);
    const t3 = setTimeout(() => stableComplete(), 4300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [stableComplete]);

  useEffect(() => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + "px";
      c.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const w = W(), h = H();
      const elapsed = (t - startRef.current) / 1000;
      const warp = elapsed < 0.6 ? elapsed / 0.6 : elapsed > 3.4 ? Math.max(0, 1 - (elapsed - 3.4) / 0.9) : 1;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      bg.addColorStop(0, "#12032a");
      bg.addColorStop(0.45, "#06010f");
      bg.addColorStop(1, "#000000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Perspective grid zoom
      ctx.save();
      ctx.translate(w / 2, h * 0.62);
      const gridScale = 1 + elapsed * 0.08;
      ctx.scale(gridScale, gridScale);
      ctx.strokeStyle = `rgba(125, 249, 255, ${0.06 * warp})`;
      ctx.lineWidth = 1;
      for (let i = -12; i <= 12; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 40, -200);
        ctx.lineTo(i * 40, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-500, i * 18);
        ctx.lineTo(500, i * 18);
        ctx.stroke();
      }
      ctx.restore();

      // Orbiting particles
      for (let i = 0; i < 24; i++) {
        const angle = elapsed * 0.5 + (i / 24) * Math.PI * 2;
        const radius = 120 + Math.sin(elapsed + i) * 40;
        const px = w / 2 + Math.cos(angle) * radius;
        const py = h / 2 + Math.sin(angle) * radius * 0.45;
        const hue = (195 + i * 14 + elapsed * 40) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${0.12 * warp})`;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Slithering snake underline
      const snakeY = h / 2 + 100;
      for (let i = 7; i >= 0; i--) {
        const segTime = elapsed * 5 - i * 0.14;
        const segX = w / 2 + Math.sin(segTime) * 100;
        const segY = snakeY + Math.cos(segTime * 2) * 10;
        const size = i === 0 ? 7 : 5.5 - i * 0.35;
        ctx.fillStyle = `rgba(125, 249, 255, ${(0.5 + i * 0.05) * warp})`;
        ctx.shadowColor = "#7df9ff";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(segX, segY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <h1
          className="intro-game-title-main"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "scale(0.55) translateY(40px)" : "scale(1) translateY(0)",
            transition: "all 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.15s",
          }}
        >
          <span className="intro-snakey-word">SNAKEY</span>
          <span className="intro-snake-word">SNAKE</span>
        </h1>

        <div
          className="intro-line"
          style={{
            width: phase === "enter" ? "0px" : "240px",
            opacity: phase === "enter" ? 0 : 0.7,
            transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.55s",
          }}
        />

        <p
          className="intro-credit"
          style={{
            opacity: phase === "enter" ? 0 : 1,
            transform: phase === "enter" ? "translateY(24px)" : "translateY(0)",
            transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: "0.75s",
          }}
        >
          BY KUUNAL MISTRY
        </p>
      </div>

      <button
        onClick={stableComplete}
        className="absolute bottom-8 z-10 text-xs tracking-[0.3em] uppercase opacity-30 hover:opacity-60 transition-opacity text-white/70 cursor-pointer bg-transparent border-none"
      >
        Tap to skip
      </button>
    </div>
  );
}

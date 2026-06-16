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

      // Dark neon background
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.75);
      bg.addColorStop(0, "#1a0a2e");
      bg.addColorStop(0.45, "#0d021f");
      bg.addColorStop(1, "#000000");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Neon grid lines
      ctx.save();
      ctx.translate(w / 2, h * 0.62);
      const gridScale = 1 + elapsed * 0.08;
      ctx.scale(gridScale, gridScale);
      ctx.strokeStyle = `rgba(255, 0, 255, ${0.08 * warp})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = 8;
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
      ctx.shadowBlur = 0;

      // Neon snake animation
      const snakeY = h / 2 + 80;
      const snakeLength = 12;
      for (let i = snakeLength - 1; i >= 0; i--) {
        const segTime = elapsed * 4 - i * 0.12;
        const segX = w / 2 + Math.sin(segTime) * 120;
        const segY = snakeY + Math.cos(segTime * 2.5) * 15;
        const size = i === snakeLength - 1 ? 12 : 8 - i * 0.4;
        const hue = (280 + i * 15 + elapsed * 50) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${(0.6 + i * 0.03) * warp})`;
        ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(segX, segY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Floating neon fruits
      for (let i = 0; i < 8; i++) {
        const angle = elapsed * 0.8 + (i / 8) * Math.PI * 2;
        const radius = 180 + Math.sin(elapsed * 2 + i) * 30;
        const px = w / 2 + Math.cos(angle) * radius;
        const py = h / 2 - 50 + Math.sin(angle) * radius * 0.6;
        const hue = (30 + i * 40 + elapsed * 60) % 360;
        const pulse = 0.8 + 0.2 * Math.sin(elapsed * 3 + i);
        const fruitSize = 10 * pulse;
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${0.7 * warp})`;
        ctx.shadowColor = `hsl(${hue}, 100%, 65%)`;
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(px, py, fruitSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Neon particles
      for (let i = 0; i < 30; i++) {
        const angle = elapsed * 0.6 + (i / 30) * Math.PI * 2;
        const radius = 250 + Math.sin(elapsed + i * 0.5) * 50;
        const px = w / 2 + Math.cos(angle) * radius;
        const py = h / 2 + Math.sin(angle) * radius * 0.7;
        const hue = (180 + i * 12 + elapsed * 30) % 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${0.15 * warp})`;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(px, py, 2 + (i % 2), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-black"
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
    </div>
  );
}

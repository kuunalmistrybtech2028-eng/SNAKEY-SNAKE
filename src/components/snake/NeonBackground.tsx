import { useEffect, useRef } from "react";

/**
 * Lightweight animated neon cyber-grid background.
 * Renders to a single low-resolution canvas with cheap effects.
 * Now with enhanced visual effects and more dynamic animations.
 */
export function NeonBackground({ intensity = 1, theme }: { intensity?: number; theme?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d", { alpha: true })!;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const dots: { x: number; y: number; vx: number; vy: number; r: number; hue: number }[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots.length = 0;
    const n = Math.round(Math.min(40, (w * h) / 30000) * intensity);
      for (let i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.6 + Math.random() * 1.8,
          hue: 190 + Math.random() * 130,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let t0 = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!t0) t0 = t;
      const dt = Math.min(64, t - t0); t0 = t;
      ctx.clearRect(0, 0, w, h);
      // ambient gradient blobs with enhanced colors
      const tm = t / 8000;
      const blob = (cx: number, cy: number, color: string, r: number) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      };
      
      // Enhanced blob colors based on theme
      if (theme === "candy-land") {
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(255,85,196,0.22)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(255,170,0,0.2)", Math.max(w, h) * 0.55);
      } else if (theme === "ice-crystal") {
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(126,243,255,0.2)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(100,200,255,0.18)", Math.max(w, h) * 0.55);
      } else if (theme === "inferno-blaze") {
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(255,85,0,0.24)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(255,40,0,0.2)", Math.max(w, h) * 0.55);
      } else if (theme === "tropical-vibes") {
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(255,170,0,0.2)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(0,200,100,0.18)", Math.max(w, h) * 0.55);
      } else if (theme === "electric-storm") {
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(0,255,255,0.22)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(100,200,255,0.2)", Math.max(w, h) * 0.55);
      } else {
        // Default colors
        blob(w * (0.3 + Math.sin(tm) * 0.12), h * (0.35 + Math.cos(tm) * 0.1), "rgba(34,211,238,0.2)", Math.max(w, h) * 0.55);
        blob(w * (0.7 + Math.cos(tm * 1.3) * 0.1), h * (0.65 + Math.sin(tm * 0.9) * 0.12), "rgba(168,85,247,0.18)", Math.max(w, h) * 0.55);
      }
      blob(w * (0.5 + Math.sin(tm * 0.7) * 0.18), h * (0.85 + Math.cos(tm * 1.1) * 0.05), "rgba(244,114,182,0.14)", Math.max(w, h) * 0.5);

      // enhanced faint grid with more visibility
      ctx.strokeStyle = "rgba(125,249,255,0.08)";
      ctx.lineWidth = 1.2;
      const step = 48;
      ctx.beginPath();
      const off = (t / 60) % step;
      for (let x = -off; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = -off; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();

      // floating dots with enhanced glow
      for (const d of dots) {
        d.x += d.vx * (dt / 16); d.y += d.vy * (dt / 16);
        if (d.x < -10) d.x = w + 10; if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10; if (d.y > h + 10) d.y = -10;
        ctx.fillStyle = `hsla(${d.hue}, 95%, 65%, 0.7)`;
        ctx.shadowColor = `hsl(${d.hue}, 95%, 70%)`;
        ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      
      // Add some pulsing elements for extra visual interest
      const pulse = Math.sin(t / 1500) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(125,249,255,${pulse * 0.04})`;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, Math.max(w, h) * 0.3 * pulse, 0, Math.PI * 2);
      ctx.fill();
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [intensity, theme]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0633 0%, #07020f 70%)" }}
    />
  );
}
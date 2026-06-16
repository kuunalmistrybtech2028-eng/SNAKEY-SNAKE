import type { TrailDef } from "@/lib/snake/cosmetics";

export interface TrailGhost {
  x: number;
  y: number;
  life: number;
  max: number;
}

export function spawnTrailGhost(
  ghosts: TrailGhost[],
  x: number,
  y: number,
  maxLife = 520,
  maxCount = 90,
) {
  ghosts.push({ x, y, life: maxLife, max: maxLife });
  if (ghosts.length > maxCount) ghosts.shift();
}

export function drawTrailGhosts(
  ctx: CanvasRenderingContext2D,
  trail: TrailDef,
  ghosts: TrailGhost[],
  cell: number,
  timeMs: number,
  blurMult: number,
) {
  if (trail.id === "none" || !ghosts.length) return;

  for (let i = 0; i < ghosts.length; i++) {
    const t = ghosts[i];
    const a = t.life / t.max;
    const cx = (t.x + 0.5) * cell;
    const cy = (t.y + 0.5) * cell;
    const baseR = cell * (0.28 + a * 0.22);

    ctx.save();
    ctx.globalAlpha = a * 0.95;

    switch (trail.id) {
      case "lightning": {
        ctx.strokeStyle = i % 2 === 0 ? trail.color : trail.secondary;
        ctx.lineWidth = Math.max(2, cell * 0.09 * a);
        ctx.shadowColor = trail.secondary;
        ctx.shadowBlur = 28 * blurMult;
        ctx.beginPath();
        ctx.moveTo(cx - baseR, cy);
        ctx.lineTo(cx, cy - baseR * 1.4);
        ctx.lineTo(cx + baseR * 0.6, cy + baseR * 0.3);
        ctx.lineTo(cx + baseR, cy - baseR * 0.5);
        ctx.stroke();
        break;
      }
      case "fire": {
        const flicker = 0.85 + 0.15 * Math.sin(timeMs / 80 + i);
        const r = baseR * flicker;
        const g = ctx.createRadialGradient(cx, cy - r * 0.3, 0, cx, cy, r);
        g.addColorStop(0, "#fff8e7");
        g.addColorStop(0.35, trail.color);
        g.addColorStop(1, trail.secondary + "00");
        ctx.fillStyle = g;
        ctx.shadowColor = trail.color;
        ctx.shadowBlur = 28 * blurMult;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "galaxy": {
        const hue = (timeMs / 40 + i * 25) % 360;
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${a * 0.85})`;
        ctx.shadowColor = trail.secondary;
        ctx.shadowBlur = 24 * blurMult;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = a * 0.6;
        ctx.beginPath();
        ctx.arc(cx - baseR * 0.3, cy - baseR * 0.3, baseR * 0.25, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "rainbow": {
        const hue = (timeMs / 30 + i * 18) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 65%)`;
        ctx.shadowColor = `hsl(${hue}, 100%, 75%)`;
        ctx.shadowBlur = 22 * blurMult;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 1.2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case "digital": {
        const sz = baseR * 1.3;
        ctx.fillStyle = i % 2 === 0 ? trail.color : trail.secondary;
        ctx.shadowColor = trail.secondary;
        ctx.shadowBlur = 20 * blurMult;
        ctx.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        ctx.globalAlpha = a * 0.45;
        ctx.strokeStyle = trail.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - sz / 2, cy - sz / 2, sz, sz);
        break;
      }
      default: {
        ctx.fillStyle = trail.color;
        ctx.shadowColor = trail.secondary;
        ctx.shadowBlur = 22 * blurMult;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

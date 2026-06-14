import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  loadSettings, setHighScore, getHighScore,
  updateMissions, getMissions, type GameMode,
  addXp, getStats, saveStats, patchStats, getProgression,
  previewLevelUps, addCoinsTracked,
} from "@/lib/snake/settings";
import { getSkin } from "@/lib/snake/skins";
import { getTrail, getHead, getTheme } from "@/lib/snake/cosmetics";
import { sfx, haptic } from "@/lib/snake/audio";
import { syncDailyDuringRun, claimAllCompletedDaily } from "@/lib/snake/dailyMissions";
import { applyBoxReward, rollMysteryBoxReward, type BoxReward } from "@/lib/snake/mysteryBox";
import { checkAchievements } from "@/lib/snake/achievements";
import { LevelUpToast, MissionCompleteToast } from "@/components/snake/LevelUpToast";
import { MysteryBoxToast } from "@/components/snake/MysteryBoxToast";
import { GameOverStats } from "@/components/snake/GameOverStats";
import { detectScreenRefreshRate, getEffectiveFpsLimit } from "@/lib/snake/fps";
import { saveLastSession, type LastSession } from "@/lib/snake/runSession";
import { spawnTrailGhost, drawTrailGhosts, type TrailGhost } from "@/lib/snake/trailEffects";

type Vec = { x: number; y: number };
type FoodKind = "normal" | "golden" | "diamond" | "rainbow" | "energy" | "legendary";
interface Food { x: number; y: number; kind: FoodKind; hue: number; born: number }
interface BoxOnField { x: number; y: number; born: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }
interface FxText { x: number; y: number; text: string; life: number; max: number; color: string; vy: number }

const RARE_KINDS: FoodKind[] = ["golden", "diamond", "rainbow", "energy", "legendary"];
function pickRareKind(): FoodKind {
  const r = Math.random();
  if (r < 0.5) return "golden";
  if (r < 0.75) return "rainbow";
  if (r < 0.9) return "energy";
  if (r < 0.98) return "diamond";
  return "legendary";
}
function fruitColor(k: FoodKind): { main: string; glow: string } {
  switch (k) {
    case "normal":    return { main: "#ffd166", glow: "#ffb347" };
    case "golden":    return { main: "#fde047", glow: "#facc15" };
    case "diamond":   return { main: "#7df9ff", glow: "#22d3ee" };
    case "rainbow":   return { main: "#ff5ec4", glow: "#7df9ff" };
    case "energy":    return { main: "#39ff88", glow: "#84cc16" };
    case "legendary": return { main: "#fef3c7", glow: "#ff5ec4" };
  }
}
function fruitReward(k: FoodKind): { score: number; xp: number; coins: number } {
  switch (k) {
    case "normal":    return { score: 1,  xp: 5,   coins: 0 };
    case "golden":    return { score: 5,  xp: 25,  coins: 5 };
    case "diamond":   return { score: 10, xp: 80,  coins: 10 };
    case "rainbow":   return { score: 3,  xp: 30,  coins: 3 };
    case "energy":    return { score: 3,  xp: 30,  coins: 3 };
    case "legendary": return { score: 25, xp: 200, coins: 50 };
  }
}

const DIRS: Record<string, Vec> = {
  up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
};

function opposite(a: Vec, b: Vec) { return a.x === -b.x && a.y === -b.y; }

function dailyUpdater(s: {
  score: number;
  eatenCount: number;
  rareCount: number;
  boxesOpened: number;
  comboCount: number;
  runStart: number;
}) {
  const survivalMs = performance.now() - s.runStart;
  return (mi: { metric: string; progress: number }) => {
    if (mi.metric === "scoreThisRun") return Math.max(mi.progress, s.score);
    if (mi.metric === "fruits") return mi.progress + s.eatenCount;
    if (mi.metric === "rare") return mi.progress + s.rareCount;
    if (mi.metric === "boxes") return mi.progress + s.boxesOpened;
    if (mi.metric === "survivalMs") return mi.progress + survivalMs;
    if (mi.metric === "games") return mi.progress + 1;
    if (mi.metric === "combo") return Math.max(mi.progress, s.comboCount);
    return mi.progress;
  };
}

export function GameCanvas({ mode }: { mode: GameMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [fps, setFps] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOverSession, setGameOverSession] = useState<LastSession | null>(null);

  const gameStateRef = useRef({
    cols: 24,
    rows: 24,
    cell: 24,
    snake: [] as Vec[],
    dir: DIRS.right,
    nextDir: DIRS.right,
    food: null as Food | null,
    rareFood: null as Food | null,
    box: null as BoxOnField | null,
    particles: [] as Particle[],
    fxTexts: [] as FxText[],
    trailGhosts: [] as TrailGhost[],
    tickAcc: 0,
    tickInterval: 110,
    lastTime: 0,
    interp: 0,
    score: 0,
    alive: true,
    paused: false,
    eatPulse: 0,
    eatenCount: 0,
    rareCount: 0,
    boxesOpened: 0,
    comboCount: 0,
    comboTimer: 0,
    multUntil: 0,
    multValue: 1,
    speedUntil: 0,
    settings: loadSettings(),
    skin: getSkin("cyber"),
    trail: getTrail("none"),
    head: getHead("none"),
    theme: getTheme("cyber-grid"),
    mode,
    timeMs: 0,
    runStart: 0,
    fpsCounter: 0,
    fpsLastTime: 0,
    effectiveFps: 60,
    pendingCoins: 0,
    pendingXp: 0,
    startLevel: 1,
    startXp: 0,
    shownLevelUps: new Set<number>(),
    notifiedMissions: new Set<string>(),
    maxCombo: 0,
  });

  const [levelUps, setLevelUps] = useState<{ level: number; coins: number; box: boolean }[]>([]);
  const [missionToasts, setMissionToasts] = useState<{ label: string; coins: number; xp: number }[]>([]);
  const pendingBoxRewardsRef = useRef<BoxReward[]>([]);
  const [boxToast, setBoxToast] = useState<BoxReward | null>(null);
  const boxToastQueueRef = useRef<BoxReward[]>([]);

  const notifyMissions = useCallback((s: typeof gameStateRef.current) => {
    const completed = syncDailyDuringRun(dailyUpdater(s));
    for (const m of completed) {
      if (s.notifiedMissions.has(m.id)) continue;
      s.notifiedMissions.add(m.id);
      setMissionToasts((prev) => [
        ...prev,
        { label: m.label, coins: m.reward.coins, xp: m.reward.xp },
      ]);
    }
  }, []);

  const previewAndToastLevelUps = useCallback((s: typeof gameStateRef.current) => {
    const preview = previewLevelUps(s.startLevel, s.startXp, s.pendingXp);
    for (const r of preview.rewards) {
      if (s.shownLevelUps.has(r.level)) continue;
      s.shownLevelUps.add(r.level);
      setLevelUps((prev) => [...prev, r]);
    }
  }, []);

  const init = useCallback(() => {
    const s = gameStateRef.current;
    s.settings = loadSettings();
    s.skin = getSkin(s.settings.skin);
    s.trail = getTrail(s.settings.trail);
    s.head = getHead(s.settings.head);
    s.theme = getTheme(s.settings.theme);
    const canvas = canvasRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const parent = canvas.parentElement!;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const size = Math.max(0, Math.min(w, h));
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    const cols = 24;
    const rows = 24;
    s.cols = cols;
    s.rows = rows;
    s.cell = canvas.width / cols;
    const cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
    s.snake = [{ x: cx - 2, y: cy }, { x: cx - 1, y: cy }, { x: cx, y: cy }];
    s.dir = DIRS.right;
    s.nextDir = DIRS.right;
    s.food = spawnFood(s.snake, cols, rows, "normal");
    s.rareFood = null;
    s.box = null;
    s.particles = [];
    s.fxTexts = [];
    s.trailGhosts = [];
    s.score = 0;
    s.alive = true;
    s.tickInterval = mode === "neon-rush" ? 75 : 110;
    s.eatenCount = 0;
    s.rareCount = 0;
    s.boxesOpened = 0;
    s.comboCount = 0;
    s.comboTimer = 0;
    s.multUntil = 0;
    s.multValue = 1;
    s.speedUntil = 0;
    s.timeMs = 0;
    s.runStart = performance.now();
    s.pendingCoins = 0;
    s.pendingXp = 0;
    s.shownLevelUps = new Set();
    s.notifiedMissions = new Set();
    s.maxCombo = 0;
    const prog = getProgression();
    s.startLevel = prog.level;
    s.startXp = prog.xp;
    setScore(0);
    setBest(getHighScore(mode));
    setGameOverSession(null);
    pendingBoxRewardsRef.current = [];
    boxToastQueueRef.current = [];
    setBoxToast(null);
    setLevelUps([]);
    setMissionToasts([]);
  }, [mode]);

  useEffect(() => {
    init();
    detectScreenRefreshRate().then((hz) => {
      gameStateRef.current.effectiveFps = getEffectiveFpsLimit(
        loadSettings().fpsLimit,
        hz,
      );
    });
    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [init]);

  useEffect(() => {
    const s = gameStateRef.current;
    const turn = (d: Vec) => {
      if (mode === "reverse") d = { x: -d.x, y: -d.y };
      if (!opposite(d, s.dir) && !(d.x === s.dir.x && d.y === s.dir.y)) s.nextDir = d;
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") { turn(DIRS.up); e.preventDefault(); }
      else if (k === "arrowdown" || k === "s") { turn(DIRS.down); e.preventDefault(); }
      else if (k === "arrowleft" || k === "a") { turn(DIRS.left); e.preventDefault(); }
      else if (k === "arrowright" || k === "d") { turn(DIRS.right); e.preventDefault(); }
      else if (k === "p" || k === "escape") setPaused((p) => !p);
      else if (k === " ") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  useEffect(() => {
    let sx = 0, sy = 0, active = false;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0]; sx = t.clientX; sy = t.clientY; active = true;
    };
    const onMove = (e: TouchEvent) => {
      if (!active) return;
      const t = e.touches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      const TH = 22;
      if (Math.abs(dx) < TH && Math.abs(dy) < TH) return;
      const s = gameStateRef.current;
      let d: Vec;
      if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? DIRS.right : DIRS.left;
      else d = dy > 0 ? DIRS.down : DIRS.up;
      if (mode === "reverse") d = { x: -d.x, y: -d.y };
      if (!opposite(d, s.dir)) s.nextDir = d;
      sx = t.clientX; sy = t.clientY;
      e.preventDefault();
    };
    const onEnd = () => { active = false; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [mode]);

  useEffect(() => {
    gameStateRef.current.paused = paused || !!gameOverSession;
  }, [paused, gameOverSession]);

  useEffect(() => {
    let raf = 0;
    const ctx = canvasRef.current!.getContext("2d", { alpha: true })!;
    let lastFrameTime = 0;

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const s = gameStateRef.current;
      const fpsLimit = s.settings.fpsLimit === "auto" ? s.effectiveFps : s.settings.fpsLimit;

      if (fpsLimit) {
        const minInterval = 1000 / fpsLimit;
        const elapsed = t - lastFrameTime;
        if (elapsed < minInterval - 0.5) return;
        lastFrameTime = t - (elapsed % minInterval);
      } else {
        lastFrameTime = t;
      }

      if (!s.lastTime) s.lastTime = t;
      const dt = Math.min(32, t - s.lastTime);
      s.lastTime = t;
      s.timeMs += dt;

      s.fpsCounter++;
      if (!s.fpsLastTime) s.fpsLastTime = t;
      if (t - s.fpsLastTime >= 1000) {
        setFps(s.fpsCounter);
        s.fpsCounter = 0;
        s.fpsLastTime = t;
      }

      if (!s.paused && s.alive) {
        s.tickAcc += dt;
        const interval = s.speedUntil > s.timeMs ? Math.max(40, s.tickInterval * 0.65) : s.tickInterval;
        while (s.tickAcc >= interval) {
          s.tickAcc -= interval;
          step(s);
          if (!s.alive) {
            handleGameOver(s);
            break;
          }
        }
        s.interp = Math.min(1, s.tickAcc / interval);

        if (s.trail.id !== "none" && s.snake.length) {
          const head = s.snake[s.snake.length - 1];
          const hx = head.x + s.dir.x * s.interp;
          const hy = head.y + s.dir.y * s.interp;
          spawnTrailGhost(s.trailGhosts, hx, hy);
        }

        if (s.comboTimer > 0) {
          s.comboTimer -= dt;
          if (s.comboTimer <= 0) s.comboCount = 0;
        }
        if (s.multUntil > 0 && s.timeMs > s.multUntil) { s.multUntil = 0; s.multValue = 1; }

        for (const p of s.particles) {
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.life -= dt;
        }
        s.particles = s.particles.filter((p) => p.life > 0);
        for (const ft of s.fxTexts) { ft.y += ft.vy * (dt / 16); ft.life -= dt; }
        s.fxTexts = s.fxTexts.filter((ft) => ft.life > 0);
        for (const g of s.trailGhosts) g.life -= dt;
        s.trailGhosts = s.trailGhosts.filter((g) => g.life > 0);
        if (s.eatPulse > 0) s.eatPulse = Math.max(0, s.eatPulse - dt);
      }
      render(ctx, s);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function handleGameOver(s: typeof gameStateRef.current) {
    const wasNew = s.score > getHighScore(s.mode);
    setHighScore(s.mode, s.score);

    syncDailyDuringRun(dailyUpdater(s));
    const claimedMissions = claimAllCompletedDaily();

    const survivalMs = performance.now() - s.runStart;
    const survivalXp = Math.floor(survivalMs / 1000) * 2;
    const endCoins = Math.max(1, Math.floor(s.score / 5));
    const totalXp = s.pendingXp + survivalXp + 25;
    const xpResult = addXp(totalXp);
    addCoinsTracked(s.pendingCoins + endCoins);

    for (const box of pendingBoxRewardsRef.current) {
      applyBoxReward(box);
    }

    const m = getMissions();
    updateMissions({
      gamesPlayed: m.gamesPlayed + 1,
      foodEaten: m.foodEaten + s.eatenCount,
      totalScore: m.totalScore + s.score,
      bestScore: Math.max(m.bestScore, s.score),
    });

    const st = getStats();
    saveStats({
      ...st,
      highestScore: Math.max(st.highestScore, s.score),
      longestSnake: Math.max(st.longestSnake, s.snake.length),
      totalGames: st.totalGames + 1,
      totalSurvivalMs: st.totalSurvivalMs + survivalMs,
    });

    const achievements = checkAchievements();

    if (s.settings.sound) sfx.over(s.settings.soundVolume);
    if (s.settings.haptics) haptic([40, 30, 90]);

    const preview = previewLevelUps(s.startLevel, s.startXp, s.pendingXp);
    const session: LastSession = {
      mode: s.mode,
      score: s.score,
      best: Math.max(getHighScore(s.mode), s.score),
      isNewRecord: wasNew,
      coinsEarned: s.pendingCoins + endCoins + preview.rewards.reduce((a, r) => a + r.coins, 0),
      xpEarned: totalXp,
      fruitsEaten: s.eatenCount,
      rareFruits: s.rareCount,
      boxesOpened: s.boxesOpened,
      survivalMs,
      snakeLength: s.snake.length,
      maxCombo: s.maxCombo,
      playedAt: Date.now(),
      rewards: {
        coinsFromFruit: s.pendingCoins,
        coinsFromEnd: endCoins,
        coinsFromLevelUps: preview.rewards.reduce((a, r) => a + r.coins, 0),
        xpEarned: totalXp,
        levelUps: preview.rewards.length ? preview.rewards : xpResult.rewards,
        boxRewards: [...pendingBoxRewardsRef.current],
        missionsCompleted: claimedMissions.map((m) => ({
          label: m.label,
          coins: m.reward.coins,
          xp: m.reward.xp,
        })),
        achievementsUnlocked: achievements.map((a) => a.label),
      },
    };

    saveLastSession(session);
    setGameOverSession(session);
  }

  function step(s: typeof gameStateRef.current) {
    s.dir = s.nextDir;
    const head = s.snake[s.snake.length - 1];
    let nx = head.x + s.dir.x;
    let ny = head.y + s.dir.y;
    if (s.settings.wallWrap) {
      nx = (nx + s.cols) % s.cols;
      ny = (ny + s.rows) % s.rows;
    } else if (nx < 0 || ny < 0 || nx >= s.cols || ny >= s.rows) {
      s.alive = false;
      return;
    }
    const ateFood = !!(s.food && nx === s.food.x && ny === s.food.y);
    const ateRare = !!(s.rareFood && nx === s.rareFood.x && ny === s.rareFood.y);
    const ateBox = !!(s.box && nx === s.box.x && ny === s.box.y);
    const grow = ateFood || ateRare;
    const cmpEnd = grow ? 0 : 1;
    for (let i = cmpEnd; i < s.snake.length; i++) {
      if (s.snake[i].x === nx && s.snake[i].y === ny) { s.alive = false; return; }
    }
    s.snake.push({ x: nx, y: ny });
    if (!grow && !ateBox) s.snake.shift();
    if (ateBox) s.snake.shift();

    if (grow || ateBox) {
      const kind: FoodKind | "box" =
        ateBox ? "box" :
        ateRare ? s.rareFood!.kind :
        "normal";

      if (kind === "box") {
        s.box = null;
        s.boxesOpened += 1;
        const reward = rollMysteryBoxReward();
        const st = getStats();
        saveStats({ ...st, mysteryBoxes: st.mysteryBoxes + 1 });
        pendingBoxRewardsRef.current.push(reward);
        boxToastQueueRef.current.push(reward);
        if (boxToastQueueRef.current.length === 1) setBoxToast(reward);
        burstParticles(s, nx, ny, "#fde047", 36);
        if (s.settings.sound) sfx.rare(s.settings.soundVolume);
        if (s.settings.haptics) haptic([8, 12, 32]);
        s.fxTexts.push({
          x: (nx + 0.5) * s.cell, y: (ny + 0.2) * s.cell,
          text: "BOX!", life: 900, max: 900, color: "#fde047", vy: -0.6,
        });
        notifyMissions(s);
      } else {
        const r = fruitReward(kind as FoodKind);
        const modeMul = s.mode === "neon-rush" ? 2 : 1;
        s.comboCount += 1;
        s.maxCombo = Math.max(s.maxCombo, s.comboCount);
        s.comboTimer = 2400;
        const comboMul = 1 + Math.min(2, (s.comboCount - 1) * 0.1);
        const mult = modeMul * comboMul * (s.multValue || 1);
        const earnedScore = Math.round(r.score * mult);
        s.score += earnedScore;
        s.eatenCount += 1;
        if (kind !== "normal") s.rareCount += 1;
        if (kind === "rainbow") { s.multUntil = s.timeMs + 30_000; s.multValue = 2; }
        if (kind === "energy") { s.speedUntil = s.timeMs + 5_000; }
        if (r.coins) s.pendingCoins += r.coins;
        if (r.xp) {
          s.pendingXp += r.xp;
          previewAndToastLevelUps(s);
        }
        setScore(s.score);
        const col = fruitColor(kind as FoodKind);
        burstParticles(s, nx, ny, col.glow, kind === "legendary" ? 50 : kind === "diamond" ? 36 : kind === "normal" ? 14 : 24);
        s.eatPulse = 220;
        if (s.settings.sound) (kind === "normal" ? sfx.eat : sfx.rare)(s.settings.soundVolume);
        if (s.settings.haptics) haptic(kind === "normal" ? 14 : [8, 14, 28]);
        if (kind === "normal") s.food = spawnFood(s.snake, s.cols, s.rows, "normal");
        else s.rareFood = null;
        if (!s.rareFood && Math.random() < 0.22) {
          s.rareFood = spawnFood(s.snake, s.cols, s.rows, pickRareKind());
        }
        if (!s.box && Math.random() < 0.04) {
          const p = spawnFood(s.snake, s.cols, s.rows, "normal");
          s.box = { x: p.x, y: p.y, born: performance.now() };
        }
        s.fxTexts.push({
          x: (nx + 0.5) * s.cell, y: (ny + 0.2) * s.cell,
          text: `+${earnedScore}${comboMul > 1.05 ? ` x${comboMul.toFixed(1)}` : ""}`,
          life: 700, max: 700, color: col.main, vy: -0.55,
        });
        if (s.mode === "classic") s.tickInterval = Math.max(70, 110 - Math.floor(s.score / 8) * 2);
        else if (s.mode === "neon-rush") s.tickInterval = Math.max(50, 75 - Math.floor(s.score / 10));
        patchStats({
          totalFruits: getStats().totalFruits + 1,
          totalRare: getStats().totalRare + (ateRare ? 1 : 0),
        });
        notifyMissions(s);
      }
    }
  }

  function burstParticles(s: typeof gameStateRef.current, gx: number, gy: number, color: string, count: number) {
    if (s.settings.particles === "off") return;
    const density = s.settings.particles === "low" ? 0.4 : s.settings.particles === "medium" ? 0.75 : 1;
    const n = Math.round(count * density);
    const cx = (gx + 0.5) * s.cell;
    const cy = (gy + 0.5) * s.cell;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 3.5;
      s.particles.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 380 + Math.random() * 260, max: 640,
        color, size: 1.4 + Math.random() * 2.6,
      });
    }
  }

  function spawnFood(snake: Vec[], cols: number, rows: number, kind: FoodKind): Food {
    const taken = new Set(snake.map((p) => p.x + "," + p.y));
    let x = 0, y = 0;
    for (let i = 0; i < 200; i++) {
      x = Math.floor(Math.random() * cols);
      y = Math.floor(Math.random() * rows);
      if (!taken.has(x + "," + y)) break;
    }
    return { x, y, kind, hue: Math.random() * 360, born: performance.now() };
  }

  function render(ctx: CanvasRenderingContext2D, s: typeof gameStateRef.current) {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    ctx.clearRect(0, 0, W, H);
    const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? 0.35 : 1;
    const th = s.theme;
    const tMs = s.timeMs;

    let hA = th.hueA, hB = th.hueB, hC = th.hueC;
    if (s.settings.background) {
      if (th.id === "aurora") {
        hA += Math.sin(tMs / 2500) * 15;
        hB += Math.cos(tMs / 3000) * 12;
        hC += Math.sin(tMs / 2000) * 10;
      } else if (th.id === "synthwave") {
        hA += Math.sin(tMs / 4000) * 8;
        hB += Math.cos(tMs / 5000) * 10;
      }
    }

    const g = ctx.createRadialGradient(W / 2, H / 2, W * 0.05, W / 2, H / 2, W * 0.8);
    g.addColorStop(0, `hsla(${hA}, 70%, 10%, 0.95)`);
    g.addColorStop(0.6, `hsla(${hB}, 80%, 5%, 0.98)`);
    g.addColorStop(1, `hsla(${hC}, 70%, 2%, 1)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (s.settings.grid) {
      ctx.strokeStyle = "rgba(125, 249, 255, 0.07)";
      ctx.lineWidth = Math.max(1, s.cell * 0.03);
      ctx.beginPath();
      for (let i = 1; i < s.cols; i++) {
        const x = i * s.cell;
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let j = 1; j < s.rows; j++) {
        const y = j * s.cell;
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = th.accent + "73";
    ctx.lineWidth = Math.max(2, s.cell * 0.08);
    ctx.shadowColor = th.accent;
    ctx.shadowBlur = 18 * blurMult;
    ctx.strokeRect(1, 1, W - 2, H - 2);
    ctx.shadowBlur = 0;

    if (s.box) drawBox(ctx, s, s.box);

    drawTrailGhosts(ctx, s.trail, s.trailGhosts, s.cell, tMs, blurMult);

    const tNow = s.timeMs;
    drawFood(ctx, s, s.food, tNow);
    if (s.rareFood) drawFood(ctx, s, s.rareFood, tNow);
    drawSnake(ctx, s);

    for (const p of s.particles) {
      const a = Math.max(0, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12 * blurMult;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = `bold ${Math.round(s.cell * 0.55)}px ui-sans-serif, system-ui`;
    ctx.textAlign = "center";
    for (const ft of s.fxTexts) {
      const a = ft.life / ft.max;
      ctx.globalAlpha = a;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 10 * blurMult;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function drawFood(ctx: CanvasRenderingContext2D, s: typeof gameStateRef.current, f: Food | null, tNow: number) {
    if (!f) return;
    const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? 0.35 : 1;
    const rare = f.kind !== "normal";
    const { main, glow } = fruitColor(f.kind);
    const cx = (f.x + 0.5) * s.cell;
    const cy = (f.y + 0.5) * s.cell;
    const pulse = 0.5 + 0.5 * Math.sin((tNow - f.born) / (rare ? 180 : 260));
    const baseR = f.kind === "legendary" ? 0.48 : f.kind === "diamond" ? 0.44 : rare ? 0.4 : 0.32;
    const r = s.cell * baseR * (0.92 + pulse * 0.12);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(((tNow / (rare ? 600 : 1200)) % (Math.PI * 2)));
    ctx.shadowColor = glow;
    ctx.shadowBlur = (f.kind === "legendary" ? 44 : rare ? 30 : 16) * blurMult;
    const grd = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r);
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(0.4, main);
    grd.addColorStop(1, glow);
    ctx.fillStyle = grd;
    if (f.kind === "diamond" || f.kind === "rainbow") {
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.fill();
    } else if (f.kind === "legendary") {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.5;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawBox(ctx: CanvasRenderingContext2D, s: typeof gameStateRef.current, b: BoxOnField) {
    const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? 0.35 : 1;
    const cx = (b.x + 0.5) * s.cell;
    const cy = (b.y + 0.5) * s.cell;
    const pulse = 0.5 + 0.5 * Math.sin((performance.now() - b.born) / 220);
    const r = s.cell * 0.42 * (0.95 + pulse * 0.1);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(((performance.now() / 1500) % (Math.PI * 2)));
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur = 28 * blurMult;
    const grd = ctx.createLinearGradient(-r, -r, r, r);
    grd.addColorStop(0, "#fde047");
    grd.addColorStop(0.5, "#ff9551");
    grd.addColorStop(1, "#ff5ec4");
    ctx.fillStyle = grd;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = Math.max(1, s.cell * 0.05);
    ctx.strokeRect(-r, -r, r * 2, r * 2);
    ctx.beginPath();
    ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r);
    ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawSnake(ctx: CanvasRenderingContext2D, s: typeof gameStateRef.current) {
    const blurMult = s.settings.graphics === "low" ? 0 : s.settings.graphics === "medium" ? 0.35 : 1;
    const interp = s.alive && !s.paused ? s.interp : 0;
    const segs = s.snake;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < segs.length; i++) {
      const cur = segs[i];
      let x = cur.x, y = cur.y;
      if (i === segs.length - 1) {
        x = cur.x + s.dir.x * interp;
        y = cur.y + s.dir.y * interp;
      } else {
        const nxt = segs[i + 1];
        const dx = nxt.x - cur.x, dy = nxt.y - cur.y;
        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
          x = cur.x + dx * interp;
          y = cur.y + dy * interp;
        }
      }
      points.push({ x: (x + 0.5) * s.cell, y: (y + 0.5) * s.cell });
    }

    const skin = s.skin;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = skin.glow;
    ctx.shadowColor = skin.glow;
    ctx.shadowBlur = 24 * blurMult;
    ctx.lineWidth = s.cell * 0.85;
    strokePath(ctx, points, s.cell);
    ctx.shadowBlur = 10 * blurMult;
    ctx.strokeStyle = skin.body;
    ctx.lineWidth = s.cell * 0.66;
    strokePath(ctx, points, s.cell);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = s.cell * 0.18;
    strokePath(ctx, points, s.cell);

    const head = points[points.length - 1];
    const r = s.cell * 0.42;
    ctx.shadowColor = skin.glow;
    ctx.shadowBlur = 20 * blurMult;
    const hg = ctx.createRadialGradient(head.x - r * 0.3, head.y - r * 0.3, r * 0.1, head.x, head.y, r);
    hg.addColorStop(0, "#ffffff");
    hg.addColorStop(0.4, skin.head);
    hg.addColorStop(1, skin.body);
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    const dir = s.dir;
    const perp = { x: -dir.y, y: dir.x };
    const eyeOff = r * 0.35;
    const eyeR = r * 0.18;
    const blink = Math.sin(s.timeMs / 1700);
    const blinking = blink > 0.95 ? 0.15 : 1;
    for (const sgn of [-1, 1]) {
      const ex = head.x + perp.x * eyeOff * sgn + dir.x * r * 0.25;
      const ey = head.y + perp.y * eyeOff * sgn + dir.y * r * 0.25;
      ctx.fillStyle = "#0b0420";
      ctx.beginPath();
      ctx.ellipse(ex, ey, eyeR, eyeR * blinking, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(ex + dir.x * eyeR * 0.3, ey + dir.y * eyeR * 0.3, eyeR * 0.4 * blinking, 0, Math.PI * 2);
      ctx.fill();
    }
    drawHeadEffect(ctx, s, head, r, blurMult);
  }

  function drawHeadEffect(
    ctx: CanvasRenderingContext2D,
    s: typeof gameStateRef.current,
    head: { x: number; y: number },
    r: number,
    blurMult: number,
  ) {
    const h = s.head;
    if (h.kind === "none") return;
    ctx.save();
    ctx.shadowColor = h.color;
    ctx.shadowBlur = 20 * blurMult;
    if (h.kind === "halo") {
      ctx.strokeStyle = h.color;
      ctx.lineWidth = Math.max(1.5, s.cell * 0.06);
      ctx.beginPath();
      ctx.ellipse(head.x, head.y - r * 0.9, r * 0.85, r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (h.kind === "crown") {
      ctx.fillStyle = h.color;
      const y = head.y - r * 1.1;
      ctx.beginPath();
      ctx.moveTo(head.x - r * 0.7, y);
      ctx.lineTo(head.x - r * 0.4, y - r * 0.6);
      ctx.lineTo(head.x - r * 0.15, y - r * 0.15);
      ctx.lineTo(head.x, y - r * 0.7);
      ctx.lineTo(head.x + r * 0.15, y - r * 0.15);
      ctx.lineTo(head.x + r * 0.4, y - r * 0.6);
      ctx.lineTo(head.x + r * 0.7, y);
      ctx.closePath();
      ctx.fill();
    } else if (h.kind === "core") {
      const grd = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 1.4);
      grd.addColorStop(0, h.color + "ff");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(head.x, head.y, r * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function strokePath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[], cell: number) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      const prev = pts[i - 1];
      if (Math.hypot(p.x - prev.x, p.y - prev.y) > cell * 2.2) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
  }

  const dismissBoxToast = useCallback(() => {
    boxToastQueueRef.current = boxToastQueueRef.current.slice(1);
    setBoxToast(boxToastQueueRef.current[0] ?? null);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[100dvh] py-2">
      <div className="w-full max-w-[min(95vw,900px)] flex items-center justify-between px-2 py-1 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="neon-btn neon-btn-hover !px-3 !py-2 text-xs"
            aria-label="Back"
          >
            ←
          </button>
          <div className="neon-panel rounded-xl px-3 py-1.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Score</div>
            <div className="text-lg font-bold neon-text leading-none">{score}</div>
          </div>
          <div className="neon-panel rounded-xl px-3 py-1.5">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Best</div>
            <div className="text-lg font-bold text-foreground leading-none">{best}</div>
          </div>
          <div className="neon-panel rounded-xl px-3 py-1.5 min-w-[52px] text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">FPS</div>
            <div className="text-lg font-bold text-cyan-400 leading-none">{fps}</div>
          </div>
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="neon-btn neon-btn-hover !px-3 !py-2 text-xs"
          aria-label="Pause"
        >
          {paused ? "▶" : "❚❚"}
        </button>
      </div>

      <div
        className="relative aspect-square shrink-0"
        style={{ width: "min(95vw, 85dvh, 900px)" }}
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden neon-panel" />
        <div className="relative w-full h-full p-1.5 flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-xl touch-none select-none" />
        </div>

        {paused && !gameOverSession && (
          <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-background/60 backdrop-blur-md animate-fade-up">
            <div className="text-center space-y-4">
              <div className="text-3xl font-bold neon-text animate-title-glow">PAUSED</div>
              <div className="flex gap-3 justify-center">
                <button className="neon-btn neon-btn-hover" onClick={() => setPaused(false)}>Resume</button>
                <button className="neon-btn neon-btn-hover" onClick={() => init()}>Restart</button>
              </div>
            </div>
          </div>
        )}

        {gameOverSession && (
          <GameOverStats session={gameOverSession} onPlayAgain={() => init()} />
        )}
      </div>

      <div className="text-[11px] text-muted-foreground tracking-widest uppercase mt-2 opacity-70 shrink-0">
        Swipe to steer · WASD / Arrows
      </div>

      <LevelUpToast queue={levelUps} onConsume={() => setLevelUps((q) => q.slice(1))} />
      <MissionCompleteToast
        queue={missionToasts}
        onConsume={() => setMissionToasts((q) => q.slice(1))}
      />
      {boxToast && !gameOverSession && (
        <MysteryBoxToast reward={boxToast} onDone={dismissBoxToast} />
      )}
    </div>
  );
}

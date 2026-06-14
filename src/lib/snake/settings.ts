import { useEffect, useState } from "react";

export type GameMode = "classic" | "neon-rush" | "reverse";

export interface Settings {
  grid: boolean;
  wallWrap: boolean;
  fpsLimit: "auto" | 60 | 90 | 120;
  graphics: "low" | "medium" | "high";
  particles: "off" | "low" | "medium" | "high";
  background: boolean;
  swipe: boolean;
  sound: boolean;
  music: boolean;
  haptics: boolean;
  soundVolume: number;
  musicVolume: number;
  performance: "battery" | "balanced" | "performance";
  skin: string;
  trail: string;
  head: string;
  theme: string;
}

export const DEFAULT_SETTINGS: Settings = {
  grid: true,
  wallWrap: false,
  fpsLimit: "auto",
  graphics: "high",
  particles: "medium",
  background: true,
  swipe: true,
  sound: true,
  music: false,
  haptics: true,
  soundVolume: 0.8,
  musicVolume: 0.5,
  performance: "balanced",
  skin: "cyber",
  trail: "none",
  head: "none",
  theme: "cyber-grid",
};

const KEY = "snakey:settings:v1";
const HS_KEY = "snakey:highscore:v1";
const COIN_KEY = "snakey:coins:v1";
const SKIN_KEY = "snakey:ownedSkins:v1";
const MISSION_KEY = "snakey:missions:v1";
const PROG_KEY = "snakey:progression:v1";
const STATS_KEY = "snakey:stats:v1";
const ACH_KEY = "snakey:achievements:v1";
const DAILY_KEY = "snakey:daily:v1";
const LOGIN_KEY = "snakey:login:v1";
const OWN_KEY = "snakey:owned:v1"; // {trails, heads, themes}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
export function saveSettings(s: Settings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function useSettings(): [Settings, (patch: Partial<Settings>) => void] {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS);
  useEffect(() => { setS(loadSettings()); }, []);
  const patch = (p: Partial<Settings>) => {
    setS((prev) => {
      const next = { ...prev, ...p };
      saveSettings(next);
      return next;
    });
  };
  return [s, patch];
}

export function getHighScore(mode: GameMode): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(HS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    return map[mode] ?? 0;
  } catch { return 0; }
}
export function setHighScore(mode: GameMode, score: number) {
  try {
    const raw = localStorage.getItem(HS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    if (score > (map[mode] ?? 0)) {
      map[mode] = score;
      localStorage.setItem(HS_KEY, JSON.stringify(map));
    }
  } catch {}
}

export function getCoins(): number {
  if (typeof window === "undefined") return 0;
  try { return parseInt(localStorage.getItem(COIN_KEY) || "0", 10) || 0; } catch { return 0; }
}
export function addCoins(n: number) {
  try { localStorage.setItem(COIN_KEY, String(getCoins() + n)); } catch {}
}

export function getOwnedSkins(): string[] {
  if (typeof window === "undefined") return ["cyber"];
  try {
    const raw = localStorage.getItem(SKIN_KEY);
    return raw ? JSON.parse(raw) : ["cyber"];
  } catch { return ["cyber"]; }
}
export function buySkin(id: string) {
  const owned = getOwnedSkins();
  if (!owned.includes(id)) {
    owned.push(id);
    try { localStorage.setItem(SKIN_KEY, JSON.stringify(owned)); } catch {}
  }
}

// ============ Cosmetics ownership (trails/heads/themes) ============
export interface OwnedCosmetics { trails: string[]; heads: string[]; themes: string[] }
const DEFAULT_OWNED: OwnedCosmetics = { trails: ["none"], heads: ["none"], themes: ["cyber-grid"] };
export function getOwned(): OwnedCosmetics {
  if (typeof window === "undefined") return DEFAULT_OWNED;
  try {
    const raw = localStorage.getItem(OWN_KEY);
    if (!raw) return DEFAULT_OWNED;
    const p = JSON.parse(raw);
    return {
      trails: Array.from(new Set(["none", ...(p.trails ?? [])])),
      heads: Array.from(new Set(["none", ...(p.heads ?? [])])),
      themes: Array.from(new Set(["cyber-grid", ...(p.themes ?? [])])),
    };
  } catch { return DEFAULT_OWNED; }
}
export function buyCosmetic(kind: keyof OwnedCosmetics, id: string) {
  const o = getOwned();
  if (!o[kind].includes(id)) {
    o[kind].push(id);
    try { localStorage.setItem(OWN_KEY, JSON.stringify(o)); } catch {}
  }
}

export interface MissionState {
  // running counters
  foodEaten: number;
  gamesPlayed: number;
  bestScore: number;
  totalScore: number;
}
export const DEFAULT_MISSIONS: MissionState = {
  foodEaten: 0, gamesPlayed: 0, bestScore: 0, totalScore: 0,
};
export function getMissions(): MissionState {
  if (typeof window === "undefined") return DEFAULT_MISSIONS;
  try {
    const raw = localStorage.getItem(MISSION_KEY);
    return raw ? { ...DEFAULT_MISSIONS, ...JSON.parse(raw) } : DEFAULT_MISSIONS;
  } catch { return DEFAULT_MISSIONS; }
}
export function updateMissions(patch: Partial<MissionState>) {
  const cur = getMissions();
  const next = { ...cur, ...patch };
  try { localStorage.setItem(MISSION_KEY, JSON.stringify(next)); } catch {}
}

// ============ Progression (XP / Level) ============
export interface Progression { xp: number; level: number; totalXp: number }
const DEFAULT_PROG: Progression = { xp: 0, level: 1, totalXp: 0 };

// XP needed to advance from `level` to `level+1`
export function xpForLevel(level: number): number {
  // Smooth curve: easy early, harder late. Caps growth.
  return Math.round(50 + level * 35 + Math.pow(level, 1.55) * 6);
}
export function getProgression(): Progression {
  if (typeof window === "undefined") return DEFAULT_PROG;
  try {
    const raw = localStorage.getItem(PROG_KEY);
    return raw ? { ...DEFAULT_PROG, ...JSON.parse(raw) } : DEFAULT_PROG;
  } catch { return DEFAULT_PROG; }
}
export function saveProgression(p: Progression) {
  try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch {}
}
/**
 * Add XP, return { progression, levelsGained, levelUps:[{level, reward}] }
 */
/** Preview level-ups from XP gain without persisting — used during gameplay. */
export function previewLevelUps(
  startLevel: number,
  startXp: number,
  xpGain: number,
): { level: number; xp: number; rewards: { level: number; coins: number; box: boolean }[] } {
  let level = startLevel;
  let xp = startXp + Math.max(0, xpGain);
  const rewards: { level: number; coins: number; box: boolean }[] = [];
  while (level < 200 && xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    const coins = 50 + level * 10;
    const box = level % 5 === 0;
    rewards.push({ level, coins, box });
  }
  if (level >= 200) xp = 0;
  return { level, xp, rewards };
}

export function addXp(amount: number): { prog: Progression; levelsGained: number; rewards: { level: number; coins: number; box: boolean }[] } {
  const p = getProgression();
  p.totalXp += Math.max(0, amount);
  p.xp += Math.max(0, amount);
  const rewards: { level: number; coins: number; box: boolean }[] = [];
  let gained = 0;
  while (p.level < 200 && p.xp >= xpForLevel(p.level)) {
    p.xp -= xpForLevel(p.level);
    p.level += 1;
    gained += 1;
    const coins = 50 + p.level * 10;
    const box = p.level % 5 === 0;
    addCoins(coins);
    if (box) openMysteryBoxFromLevel();
    rewards.push({ level: p.level, coins, box });
  }
  if (p.level >= 200) p.xp = 0;
  saveProgression(p);
  return { prog: p, levelsGained: gained, rewards };
}
function openMysteryBoxFromLevel() {
  // hook used by progression — increments stat
  const s = getStats();
  saveStats({ ...s, mysteryBoxes: s.mysteryBoxes + 1 });
}

// ============ Stats ============
export interface Stats {
  highestScore: number;
  longestSnake: number;
  totalFruits: number;
  totalRare: number;
  totalGames: number;
  totalSurvivalMs: number;
  achievementsCompleted: number;
  missionsCompleted: number;
  loginStreak: number;
  bestLoginStreak: number;
  mysteryBoxes: number;
  totalCoinsEarned: number;
}
const DEFAULT_STATS: Stats = {
  highestScore: 0, longestSnake: 0, totalFruits: 0, totalRare: 0,
  totalGames: 0, totalSurvivalMs: 0, achievementsCompleted: 0,
  missionsCompleted: 0, loginStreak: 0, bestLoginStreak: 0,
  mysteryBoxes: 0, totalCoinsEarned: 0,
};
export function getStats(): Stats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch { return DEFAULT_STATS; }
}
export function saveStats(s: Stats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {}
}
export function patchStats(patch: Partial<Stats>) {
  saveStats({ ...getStats(), ...patch });
}

// Track coins earned cumulatively (positive only)
export function addCoinsTracked(n: number) {
  if (n > 0) {
    const s = getStats();
    saveStats({ ...s, totalCoinsEarned: s.totalCoinsEarned + n });
  }
  addCoins(n);
}

// ============ Achievements unlocked store ============
export function getCompletedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function markAchievementCompleted(id: string) {
  const list = getCompletedAchievements();
  if (!list.includes(id)) {
    list.push(id);
    try { localStorage.setItem(ACH_KEY, JSON.stringify(list)); } catch {}
    const s = getStats();
    saveStats({ ...s, achievementsCompleted: list.length });
  }
}

// ============ Daily Missions ============
export interface DailyMission {
  id: string;
  label: string;
  metric: "scoreThisRun" | "fruits" | "rare" | "survivalMs" | "games" | "combo" | "boxes";
  target: number;
  progress: number;
  claimed: boolean;
  reward: { coins: number; xp: number; box?: boolean };
}
export interface DailyState { date: string; missions: DailyMission[] }
export function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}
export function getDaily(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return null;
    const p: DailyState = JSON.parse(raw);
    return p;
  } catch { return null; }
}
export function saveDaily(d: DailyState) {
  try { localStorage.setItem(DAILY_KEY, JSON.stringify(d)); } catch {}
}

// ============ Login rewards ============
export interface LoginState { lastDay: string | null; index: number /* 0..6 */; claimedToday: boolean }
const DEFAULT_LOGIN: LoginState = { lastDay: null, index: 0, claimedToday: false };
export function getLogin(): LoginState {
  if (typeof window === "undefined") return DEFAULT_LOGIN;
  try {
    const raw = localStorage.getItem(LOGIN_KEY);
    return raw ? { ...DEFAULT_LOGIN, ...JSON.parse(raw) } : DEFAULT_LOGIN;
  } catch { return DEFAULT_LOGIN; }
}
export function saveLogin(l: LoginState) {
  try { localStorage.setItem(LOGIN_KEY, JSON.stringify(l)); } catch {}
}

export function exportSaveData(): string {
  const data: Record<string, string | null> = {};
  const keys = [KEY, HS_KEY, COIN_KEY, SKIN_KEY, MISSION_KEY, PROG_KEY, STATS_KEY, ACH_KEY, DAILY_KEY, LOGIN_KEY, OWN_KEY];
  for (const k of keys) {
    try {
      data[k] = localStorage.getItem(k);
    } catch {}
  }
  return JSON.stringify(data);
}

export function importSaveData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    const keys = [KEY, HS_KEY, COIN_KEY, SKIN_KEY, MISSION_KEY, PROG_KEY, STATS_KEY, ACH_KEY, DAILY_KEY, LOGIN_KEY, OWN_KEY];
    for (const k of keys) {
      if (k in data) {
        if (data[k] === null) {
          localStorage.removeItem(k);
        } else {
          localStorage.setItem(k, data[k]);
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function resetSaveData() {
  const keys = [KEY, HS_KEY, COIN_KEY, SKIN_KEY, MISSION_KEY, PROG_KEY, STATS_KEY, ACH_KEY, DAILY_KEY, LOGIN_KEY, OWN_KEY];
  for (const k of keys) {
    try { localStorage.removeItem(k); } catch {}
  }
}
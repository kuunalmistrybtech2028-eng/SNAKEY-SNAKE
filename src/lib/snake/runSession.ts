import type { GameMode } from "@/lib/snake/settings";
import type { BoxReward } from "@/lib/snake/mysteryBox";

const SESSION_KEY = "snakey:lastSession:v1";

export interface RunRewardSummary {
  coinsFromFruit: number;
  coinsFromEnd: number;
  coinsFromLevelUps: number;
  xpEarned: number;
  levelUps: { level: number; coins: number; box: boolean }[];
  boxRewards: BoxReward[];
  missionsCompleted: { label: string; coins: number; xp: number }[];
  achievementsUnlocked: string[];
}

export interface LastSession {
  mode: GameMode;
  score: number;
  best: number;
  isNewRecord: boolean;
  coinsEarned: number;
  xpEarned: number;
  fruitsEaten: number;
  rareFruits: number;
  boxesOpened: number;
  survivalMs: number;
  snakeLength: number;
  maxCombo: number;
  rewards: RunRewardSummary;
  playedAt: number;
}

export function saveLastSession(session: LastSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function getLastSession(): LastSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

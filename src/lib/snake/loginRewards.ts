import {
  type LoginState, getLogin, saveLogin, addCoinsTracked, addXp,
  buyCosmetic, getStats, saveStats, todayKey,
} from "@/lib/snake/settings";

export interface LoginReward {
  day: number; label: string; coins?: number; xp?: number; box?: boolean; cosmetic?: { kind: "trails"; id: string };
}

export const LOGIN_CALENDAR: LoginReward[] = [
  { day: 1, label: "50 Coins", coins: 50, xp: 20 },
  { day: 2, label: "100 Coins", coins: 100, xp: 40 },
  { day: 3, label: "Rare Boost +XP", coins: 50, xp: 150 },
  { day: 4, label: "150 Coins", coins: 150, xp: 60 },
  { day: 5, label: "Mystery Box", coins: 75, xp: 100, box: true },
  { day: 6, label: "250 Coins", coins: 250, xp: 100 },
  { day: 7, label: "Lightning Trail", coins: 200, xp: 200, cosmetic: { kind: "trails", id: "lightning" } },
];

function yesterdayKey(): string {
  const d = new Date(); d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

/**
 * Call on app open. Updates streak; if lastDay === yesterday, advance index; if today, no change;
 * else reset to day 1. Returns state with claimedToday flag.
 */
export function syncLogin(): LoginState {
  const l = getLogin();
  const today = todayKey();
  if (l.lastDay === today) return l;
  if (l.lastDay === yesterdayKey()) {
    l.index = (l.index + 1) % 7;
  } else {
    l.index = 0;
  }
  l.lastDay = today;
  l.claimedToday = false;
  saveLogin(l);
  // streak tracking
  const s = getStats();
  const newStreak = (l.index === 0 && l.lastDay !== null) ? 1 : (s.loginStreak + 1);
  saveStats({ ...s, loginStreak: newStreak, bestLoginStreak: Math.max(s.bestLoginStreak, newStreak) });
  return l;
}

export function claimLoginReward(): LoginReward | null {
  const l = getLogin();
  if (l.claimedToday) return null;
  const r = LOGIN_CALENDAR[l.index];
  if (r.coins) addCoinsTracked(r.coins);
  if (r.xp) addXp(r.xp);
  if (r.cosmetic) buyCosmetic(r.cosmetic.kind, r.cosmetic.id);
  if (r.box) {
    const s = getStats(); saveStats({ ...s, mysteryBoxes: s.mysteryBoxes + 1 });
  }
  l.claimedToday = true;
  saveLogin(l);
  return r;
}
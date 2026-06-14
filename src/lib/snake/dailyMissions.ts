import {
  type DailyMission, type DailyState,
  getDaily, saveDaily, todayKey,
  getProgression, addCoinsTracked, addXp, getStats, saveStats,
} from "@/lib/snake/settings";

const POOL: Omit<DailyMission, "progress" | "claimed" | "id">[] = [
  { label: "Eat 25 fruits", metric: "fruits", target: 25, reward: { coins: 75, xp: 100 } },
  { label: "Eat 100 fruits", metric: "fruits", target: 100, reward: { coins: 200, xp: 300 } },
  { label: "Reach score 100", metric: "scoreThisRun", target: 100, reward: { coins: 150, xp: 200 } },
  { label: "Reach score 500", metric: "scoreThisRun", target: 500, reward: { coins: 500, xp: 700 } },
  { label: "Survive 2 minutes", metric: "survivalMs", target: 120_000, reward: { coins: 200, xp: 250 } },
  { label: "Survive 5 minutes", metric: "survivalMs", target: 300_000, reward: { coins: 500, xp: 600 } },
  { label: "Collect 3 rare fruits", metric: "rare", target: 3, reward: { coins: 250, xp: 300, box: true } },
  { label: "Open 1 mystery box", metric: "boxes", target: 1, reward: { coins: 200, xp: 250 } },
  { label: "Play 3 matches", metric: "games", target: 3, reward: { coins: 100, xp: 150 } },
  { label: "Reach combo x5", metric: "combo", target: 5, reward: { coins: 150, xp: 200 } },
];

function pickThree(level: number): DailyMission[] {
  // Difficulty scales with level
  const out: DailyMission[] = [];
  const indices = new Set<number>();
  while (indices.size < 3) {
    indices.add(Math.floor(Math.random() * POOL.length));
  }
  for (const i of indices) {
    const base = POOL[i];
    const scale = 1 + Math.min(2, level / 60);
    const target = Math.round(base.target * scale);
    const coins = Math.round(base.reward.coins * scale);
    const xp = Math.round(base.reward.xp * scale);
    out.push({
      id: `${todayKey()}-${i}`,
      label: base.label,
      metric: base.metric,
      target,
      progress: 0,
      claimed: false,
      reward: { coins, xp, box: base.reward.box },
    });
  }
  return out;
}

export function ensureDaily(): DailyState {
  const today = todayKey();
  const cur = getDaily();
  if (cur && cur.date === today) return cur;
  const fresh: DailyState = { date: today, missions: pickThree(getProgression().level) };
  saveDaily(fresh);
  return fresh;
}

export function progressDaily(updater: (m: DailyMission) => number) {
  const d = ensureDaily();
  let changed = false;
  for (const m of d.missions) {
    if (m.claimed) continue;
    const next = Math.max(m.progress, Math.min(m.target, updater(m)));
    if (next !== m.progress) { m.progress = next; changed = true; }
  }
  if (changed) saveDaily(d);
}

/** Update daily mission progress during a live run; returns missions that just reached their target. */
export function syncDailyDuringRun(updater: (m: DailyMission) => number): DailyMission[] {
  const d = ensureDaily();
  const completed: DailyMission[] = [];
  let changed = false;
  for (const m of d.missions) {
    if (m.claimed) continue;
    const next = Math.max(m.progress, Math.min(m.target, updater(m)));
    if (next !== m.progress) {
      m.progress = next;
      changed = true;
      if (m.progress >= m.target) completed.push({ ...m });
    }
  }
  if (changed) saveDaily(d);
  return completed;
}

export function claimAllCompletedDaily(): DailyMission[] {
  const d = ensureDaily();
  const claimed: DailyMission[] = [];
  for (const m of d.missions) {
    if (m.claimed || m.progress < m.target) continue;
    const result = claimDaily(m.id);
    if (result) claimed.push(result);
  }
  return claimed;
}

export function claimDaily(id: string): DailyMission | null {
  const d = ensureDaily();
  const m = d.missions.find(x => x.id === id);
  if (!m || m.claimed || m.progress < m.target) return null;
  m.claimed = true;
  if (m.reward.coins) addCoinsTracked(m.reward.coins);
  if (m.reward.xp) addXp(m.reward.xp);
  saveDaily(d);
  const s = getStats();
  saveStats({ ...s, missionsCompleted: s.missionsCompleted + 1, mysteryBoxes: s.mysteryBoxes + (m.reward.box ? 1 : 0) });
  return m;
}

export function nextDailyResetMs(): number {
  const now = new Date();
  const utcMid = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return utcMid - now.getTime();
}
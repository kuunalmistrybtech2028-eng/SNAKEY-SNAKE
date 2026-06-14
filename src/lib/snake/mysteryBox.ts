import { addCoinsTracked, addXp, buyCosmetic, getStats, saveStats, getOwned } from "@/lib/snake/settings";
import { TRAILS, HEADS, THEMES } from "@/lib/snake/cosmetics";

export interface BoxReward {
  kind: "coins" | "xp" | "trail" | "head" | "theme" | "boost";
  amount?: number;
  cosmeticId?: string;
  label: string;
}

export function rollMysteryBoxReward(): BoxReward {
  const owned = getOwned();
  const lockedTrails = TRAILS.filter(t => t.id !== "none" && !owned.trails.includes(t.id));
  const lockedHeads = HEADS.filter(h => h.id !== "none" && !owned.heads.includes(h.id));
  const lockedThemes = THEMES.filter(t => !owned.themes.includes(t.id));

  const roll = Math.random();
  // ~50% coins, 20% xp, 10% trail, 5% head, 5% theme, 10% boost
  if (lockedTrails.length && roll < 0.1) {
    const c = lockedTrails[Math.floor(Math.random() * lockedTrails.length)];
    return { kind: "trail", cosmeticId: c.id, label: `${c.name} Trail` };
  }
  if (lockedHeads.length && roll < 0.15) {
    const c = lockedHeads[Math.floor(Math.random() * lockedHeads.length)];
    return { kind: "head", cosmeticId: c.id, label: `${c.name}` };
  }
  if (lockedThemes.length && roll < 0.2) {
    const c = lockedThemes[Math.floor(Math.random() * lockedThemes.length)];
    return { kind: "theme", cosmeticId: c.id, label: `${c.name} Theme` };
  }
  if (roll < 0.9) {
    const amt = 50 + Math.floor(Math.random() * 450);
    return { kind: "coins", amount: amt, label: `${amt} Coins` };
  }
  const xp = 100 + Math.floor(Math.random() * 400);
  return { kind: "xp", amount: xp, label: `${xp} XP` };
}

export function applyBoxReward(reward: BoxReward) {
  switch (reward.kind) {
    case "trail":
      if (reward.cosmeticId) buyCosmetic("trails", reward.cosmeticId);
      break;
    case "head":
      if (reward.cosmeticId) buyCosmetic("heads", reward.cosmeticId);
      break;
    case "theme":
      if (reward.cosmeticId) buyCosmetic("themes", reward.cosmeticId);
      break;
    case "coins":
      if (reward.amount) addCoinsTracked(reward.amount);
      break;
    case "xp":
      if (reward.amount) addXp(reward.amount);
      break;
    case "boost":
      break;
  }
}

export function openMysteryBox(): BoxReward {
  const reward = rollMysteryBoxReward();
  applyBoxReward(reward);
  return reward;
}

export function incrementBoxesOpened(n = 1) {
  const s = getStats();
  saveStats({ ...s, mysteryBoxes: s.mysteryBoxes + n });
}
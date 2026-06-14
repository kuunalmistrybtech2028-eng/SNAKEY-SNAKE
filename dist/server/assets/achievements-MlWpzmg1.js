import { c as getCompletedAchievements, g as getStats, h as getProgression, m as getOwnedSkins, n as addCoinsTracked, p as getOwned, r as addXp, y as markAchievementCompleted } from "./settings-CjfHWlzJ.js";
//#region src/lib/snake/achievements.ts
var ACHIEVEMENTS = [
	{
		id: "first-fruit",
		category: "Gameplay",
		label: "First Bite",
		desc: "Eat your first fruit",
		reward: {
			coins: 25,
			xp: 20
		},
		check: () => getStats().totalFruits >= 1
	},
	{
		id: "fruit-collector",
		category: "Gameplay",
		label: "Fruit Collector",
		desc: "Eat 100 fruits",
		reward: {
			coins: 100,
			xp: 100
		},
		check: () => getStats().totalFruits >= 100
	},
	{
		id: "snake-expert",
		category: "Gameplay",
		label: "Snake Expert",
		desc: "Eat 500 fruits",
		reward: {
			coins: 300,
			xp: 400
		},
		check: () => getStats().totalFruits >= 500
	},
	{
		id: "snake-legend",
		category: "Gameplay",
		label: "Snake Legend",
		desc: "Eat 2,000 fruits",
		reward: {
			coins: 1e3,
			xp: 1500
		},
		check: () => getStats().totalFruits >= 2e3
	},
	{
		id: "combo-master",
		category: "Gameplay",
		label: "Combo Master",
		desc: "Reach score 250 in a single run",
		reward: {
			coins: 200,
			xp: 250
		},
		check: () => getStats().highestScore >= 250
	},
	{
		id: "survivor",
		category: "Gameplay",
		label: "Survivor",
		desc: "Survive 5 minutes in one run",
		reward: {
			coins: 300,
			xp: 400
		},
		check: () => getStats().totalSurvivalMs >= 300 * 1e3
	},
	{
		id: "lvl-10",
		category: "Progression",
		label: "Apprentice",
		desc: "Reach level 10",
		reward: {
			coins: 100,
			xp: 0
		},
		check: () => getProgression().level >= 10
	},
	{
		id: "lvl-50",
		category: "Progression",
		label: "Veteran",
		desc: "Reach level 50",
		reward: {
			coins: 500,
			xp: 0
		},
		check: () => getProgression().level >= 50
	},
	{
		id: "lvl-100",
		category: "Progression",
		label: "Elite",
		desc: "Reach level 100",
		reward: {
			coins: 1500,
			xp: 0
		},
		check: () => getProgression().level >= 100
	},
	{
		id: "lvl-150",
		category: "Progression",
		label: "Mythic",
		desc: "Reach level 150",
		reward: {
			coins: 3e3,
			xp: 0
		},
		check: () => getProgression().level >= 150
	},
	{
		id: "lvl-200",
		category: "Progression",
		label: "Ascendant",
		desc: "Reach the maximum level 200",
		reward: {
			coins: 1e4,
			xp: 0
		},
		check: () => getProgression().level >= 200
	},
	{
		id: "skins-5",
		category: "Collection",
		label: "Stylist",
		desc: "Unlock 5 skins",
		reward: {
			coins: 150,
			xp: 200
		},
		check: () => getOwnedSkins().length >= 5
	},
	{
		id: "skins-10",
		category: "Collection",
		label: "Wardrobe",
		desc: "Unlock 10 skins",
		reward: {
			coins: 400,
			xp: 500
		},
		check: () => getOwnedSkins().length >= 10
	},
	{
		id: "themes-all",
		category: "Collection",
		label: "Theme Master",
		desc: "Unlock 5 backgrounds",
		reward: {
			coins: 500,
			xp: 600
		},
		check: () => getOwned().themes.length >= 5
	},
	{
		id: "rare-100",
		category: "Rare",
		label: "Hoarder",
		desc: "Collect 100 rare fruits",
		reward: {
			coins: 800,
			xp: 1e3
		},
		check: () => getStats().totalRare >= 100
	},
	{
		id: "boxes-50",
		category: "Rare",
		label: "Box Opener",
		desc: "Open 50 mystery boxes",
		reward: {
			coins: 1500,
			xp: 2e3
		},
		check: () => getStats().mysteryBoxes >= 50
	}
];
/**
* Scan achievements, mark newly completed, award their rewards.
* Returns array of newly-unlocked achievement labels for UI notifications.
*/
function checkAchievements() {
	const done = new Set(getCompletedAchievements());
	const unlocked = [];
	for (const a of ACHIEVEMENTS) {
		if (done.has(a.id)) continue;
		if (a.check()) {
			markAchievementCompleted(a.id);
			if (a.reward.coins) addCoinsTracked(a.reward.coins);
			if (a.reward.xp) addXp(a.reward.xp);
			unlocked.push(a);
		}
	}
	return unlocked;
}
//#endregion
export { checkAchievements as n, ACHIEVEMENTS as t };

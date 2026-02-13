import {
  ARMORY_CATALOG,
  RELIC_CATALOG,
  STORY_ARCS,
  CONTRACT_LIBRARY,
  EVENT_LIBRARY,
  NARRATIVE_FEED,
  CODEX_ENTRIES,
} from "./content/galaxyArchive.js";

const canvas = document.querySelector("#arena");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const highScoreEl = document.querySelector("#highScore");
const waveEl = document.querySelector("#wave");
const comboEl = document.querySelector("#combo");
const comboRankEl = document.querySelector("#comboRank");
const levelEl = document.querySelector("#level");
const xpTextEl = document.querySelector("#xpText");
const xpBarEl = document.querySelector("#xpBar");
const hpTextEl = document.querySelector("#hpText");
const hpBarEl = document.querySelector("#hpBar");
const shieldTextEl = document.querySelector("#shieldText");
const shieldBarEl = document.querySelector("#shieldBar");
const energyTextEl = document.querySelector("#energyText");
const energyBarEl = document.querySelector("#energyBar");
const pilotClassEl = document.querySelector("#pilotClass");
const weaponEl = document.querySelector("#weapon");
const bombsEl = document.querySelector("#bombs");
const revivesEl = document.querySelector("#revives");
const dashCdEl = document.querySelector("#dashCd");
const ultTextEl = document.querySelector("#ultText");
const ultBarEl = document.querySelector("#ultBar");
const statusEl = document.querySelector("#status");
const coresEl = document.querySelector("#cores");
const runCoresEl = document.querySelector("#runCores");
const chapterNameEl = document.querySelector("#chapterName");
const chapterSectorEl = document.querySelector("#chapterSector");
const threatTextEl = document.querySelector("#threatText");
const allyTextEl = document.querySelector("#allyText");
const achievementTextEl = document.querySelector("#achievementText");

const missionTitleEl = document.querySelector("#missionTitle");
const missionProgressEl = document.querySelector("#missionProgress");
const missionRewardEl = document.querySelector("#missionReward");
const eventTextEl = document.querySelector("#eventText");

const overlayEl = document.querySelector("#overlay");
const overlayTitleEl = document.querySelector("#overlayTitle");
const overlayTextEl = document.querySelector("#overlayText");
const overlayActionsEl = document.querySelector("#overlayActions");

const feedEl = document.querySelector("#feed");
const dialogueBoxEl = document.querySelector("#dialogueBox");
const dialogueSpeakerEl = document.querySelector("#dialogueSpeaker");
const dialogueTextEl = document.querySelector("#dialogueText");

const pauseBtn = document.querySelector("#pauseBtn");
const restartBtn = document.querySelector("#restartBtn");
const fullBtn = document.querySelector("#fullBtn");
const touchButtons = document.querySelectorAll("[data-touch]");

const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 540;
const STORAGE_KEYS = {
  highScore: "rift_runner_high_score_v2",
  cores: "rift_runner_total_cores_v2",
  bestWave: "rift_runner_best_wave_v2",
  profile: "rift_runner_profile_v4",
};

const DEFAULT_UNLOCKED_WEAPONS = ["pulse", "scatter", "rail", "arc"];

const SHOP_WEAPON_OFFERS = [
  {
    id: "nova",
    name: "新星拋射器",
    desc: "高爆裂半徑，清場能力優秀。",
    cost: 520,
  },
  {
    id: "vortex",
    name: "渦流磁軌",
    desc: "低射速高穿透，壓制直線路徑。",
    cost: 680,
  },
  {
    id: "shard",
    name: "碎晶蜂群",
    desc: "多段散射，近中距輸出爆發。",
    cost: 760,
  },
  {
    id: "flare",
    name: "日冕噴焰",
    desc: "附帶灼燒，適合連段玩法。",
    cost: 860,
  },
  {
    id: "echo",
    name: "回聲棱鏡",
    desc: "雙向折返彈道，可覆蓋寬角度。",
    cost: 980,
  },
  {
    id: "abyss",
    name: "深淵奇點",
    desc: "慢速重彈，命中後附加引力牽制。",
    cost: 1250,
  },
];

const SHOP_META_UPGRADES = [
  {
    id: "meta_hp",
    name: "生命矩陣",
    desc: "永久 +10 最大生命（最多 10 級）",
    baseCost: 220,
    maxLevel: 10,
  },
  {
    id: "meta_shield",
    name: "護盾矩陣",
    desc: "永久 +8 最大護盾（最多 10 級）",
    baseCost: 220,
    maxLevel: 10,
  },
  {
    id: "meta_damage",
    name: "火控矩陣",
    desc: "永久 +4% 傷害（最多 12 級）",
    baseCost: 280,
    maxLevel: 12,
  },
  {
    id: "meta_energy",
    name: "反應矩陣",
    desc: "永久 +3 能量回充（最多 12 級）",
    baseCost: 240,
    maxLevel: 12,
  },
  {
    id: "meta_core",
    name: "星核矩陣",
    desc: "永久 +5% 星核收益（最多 10 級）",
    baseCost: 340,
    maxLevel: 10,
  },
];

const WEAPONS = {
  pulse: {
    label: "脈衝槍",
    fireRate: 0.12,
    speed: 760,
    damage: 11,
    spread: 0.03,
    count: 1,
    pierce: 0,
    color: "#62f5ff",
    type: "normal",
  },
  scatter: {
    label: "霰裂炮",
    fireRate: 0.26,
    speed: 620,
    damage: 8,
    spread: 0.28,
    count: 5,
    pierce: 0,
    color: "#ff77dd",
    type: "normal",
  },
  rail: {
    label: "軌道矛",
    fireRate: 0.58,
    speed: 980,
    damage: 38,
    spread: 0.01,
    count: 1,
    pierce: 2,
    color: "#ffe26d",
    type: "normal",
  },
  arc: {
    label: "電弧核心",
    fireRate: 0.2,
    speed: 700,
    damage: 14,
    spread: 0.04,
    count: 1,
    pierce: 0,
    color: "#9ec5ff",
    type: "arc",
  },
  nova: {
    label: "新星拋射器",
    fireRate: 0.42,
    speed: 540,
    damage: 52,
    spread: 0.03,
    count: 1,
    pierce: 0,
    color: "#ffb17a",
    type: "explosive",
  },
  vortex: {
    label: "渦流磁軌",
    fireRate: 0.3,
    speed: 820,
    damage: 34,
    spread: 0.01,
    count: 1,
    pierce: 4,
    color: "#8be4ff",
    type: "pierce",
  },
  shard: {
    label: "碎晶蜂群",
    fireRate: 0.24,
    speed: 640,
    damage: 11,
    spread: 0.34,
    count: 7,
    pierce: 0,
    color: "#ffa1ef",
    type: "normal",
  },
  flare: {
    label: "日冕噴焰",
    fireRate: 0.1,
    speed: 600,
    damage: 8,
    spread: 0.08,
    count: 2,
    pierce: 0,
    color: "#ff8a68",
    type: "burn",
  },
  echo: {
    label: "回聲棱鏡",
    fireRate: 0.22,
    speed: 710,
    damage: 18,
    spread: 0.22,
    count: 2,
    pierce: 1,
    color: "#b6a2ff",
    type: "echo",
  },
  abyss: {
    label: "深淵奇點",
    fireRate: 0.6,
    speed: 480,
    damage: 70,
    spread: 0.02,
    count: 1,
    pierce: 0,
    color: "#8f9bff",
    type: "gravity",
  },
};

const CLASS_DEFS = {
  assault: {
    name: "突擊先鋒",
    desc: "高機動高速火力，開局就能壓制全場。",
    apply(player) {
      player.speed *= 1.14;
      player.fireRateMultiplier *= 0.9;
      player.damageMultiplier *= 1.08;
      player.weapon = "pulse";
      player.maxBombs += 1;
      player.bombs = player.maxBombs;
    },
  },
  bulwark: {
    name: "堡壘守護",
    desc: "耐久與護盾最強，越打越難倒下。",
    apply(player) {
      player.maxHp += 45;
      player.hp = player.maxHp;
      player.maxShield += 35;
      player.shield = player.maxShield;
      player.shieldRegen += 4;
      player.damageResist += 0.08;
      player.revives += 1;
      player.weapon = "rail";
    },
  },
  chrono: {
    name: "時律術士",
    desc: "慢時與能量操控大幅強化，節奏完全由你決定。",
    apply(player) {
      player.maxEnergy += 35;
      player.energy = player.maxEnergy;
      player.energyRegen += 12;
      player.slowDrain *= 0.65;
      player.ultGainMultiplier *= 1.22;
      player.weapon = "arc";
    },
  },
};

const ENEMY_TEMPLATES = {
  chaser: {
    r: 13,
    hp: 32,
    speed: 108,
    color: "#ff5f8e",
    score: 55,
    xp: 18,
    damage: 11,
  },
  shooter: {
    r: 15,
    hp: 46,
    speed: 67,
    color: "#8082ff",
    score: 82,
    xp: 23,
    damage: 9,
    fireRate: 1.36,
  },
  splitter: {
    r: 18,
    hp: 70,
    speed: 76,
    color: "#ff9f5d",
    score: 108,
    xp: 28,
    damage: 13,
  },
  tank: {
    r: 23,
    hp: 180,
    speed: 46,
    color: "#57d4ff",
    score: 180,
    xp: 44,
    damage: 22,
  },
  assassin: {
    r: 12,
    hp: 52,
    speed: 118,
    color: "#ff6cff",
    score: 115,
    xp: 30,
    damage: 15,
    burstCooldown: 2.8,
  },
  mini: {
    r: 9,
    hp: 22,
    speed: 132,
    color: "#ffbf8f",
    score: 35,
    xp: 8,
    damage: 8,
  },
  boss: {
    r: 36,
    hp: 1040,
    speed: 49,
    color: "#f2f5ff",
    score: 1700,
    xp: 210,
    damage: 19,
    fireRate: 0.52,
  },
};

const ELITE_MODS = {
  frenzy: {
    label: "狂怒",
    color: "#ff5f7f",
    apply(enemy) {
      enemy.speed *= 1.38;
      enemy.hp *= 1.25;
      enemy.score *= 1.7;
      enemy.xp *= 1.5;
      if (enemy.fireCdMax) {
        enemy.fireCdMax *= 0.8;
      }
    },
  },
  armored: {
    label: "鋼甲",
    color: "#73d8ff",
    apply(enemy) {
      enemy.hp *= 2.1;
      enemy.maxHp *= 2.1;
      enemy.speed *= 0.86;
      enemy.score *= 1.95;
      enemy.xp *= 1.75;
    },
  },
  magnetic: {
    label: "磁爆",
    color: "#c79bff",
    apply(enemy) {
      enemy.hp *= 1.55;
      enemy.score *= 1.8;
      enemy.xp *= 1.65;
      enemy.pulseCd = 2.6;
    },
  },
  volatile: {
    label: "爆裂",
    color: "#ffd06f",
    apply(enemy) {
      enemy.hp *= 1.42;
      enemy.score *= 1.72;
      enemy.xp *= 1.6;
      enemy.explosiveDeath = true;
    },
  },
};

const TALENT_POOL = [
  {
    id: "damage_plus",
    title: "熔核增壓",
    text: "傷害 +18%",
    apply(state) {
      state.player.damageMultiplier *= 1.18;
    },
  },
  {
    id: "fire_rate",
    title: "過載冷卻",
    text: "射速 +14%",
    apply(state) {
      state.player.fireRateMultiplier *= 0.86;
    },
  },
  {
    id: "max_hp",
    title: "生體擴容",
    text: "最大生命 +35，立即回復 35",
    apply(state) {
      state.player.maxHp += 35;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 35);
    },
  },
  {
    id: "shield_grid",
    title: "棱鏡護盾",
    text: "最大護盾 +24，護盾再生 +3/s",
    apply(state) {
      state.player.maxShield += 24;
      state.player.shield = Math.min(state.player.maxShield, state.player.shield + 24);
      state.player.shieldRegen += 3;
    },
  },
  {
    id: "energy_grid",
    title: "能量洪流",
    text: "最大能量 +30，回充 +8/s",
    apply(state) {
      state.player.maxEnergy += 30;
      state.player.energyRegen += 8;
      state.player.energy = state.player.maxEnergy;
    },
  },
  {
    id: "dash_matrix",
    title: "躍遷相位",
    text: "衝刺冷卻 -22%，衝刺耗能 -18%",
    apply(state) {
      state.player.dashCooldown *= 0.78;
      state.player.dashCost *= 0.82;
    },
  },
  {
    id: "bomb_stock",
    title: "深空軍械庫",
    text: "炸彈上限 +1 並補滿",
    apply(state) {
      state.player.maxBombs += 1;
      state.player.bombs = state.player.maxBombs;
    },
  },
  {
    id: "drone",
    title: "獵鷹僚機",
    text: "解鎖或升級無人機（自動追擊）",
    apply(state) {
      state.player.droneLevel += 1;
    },
  },
  {
    id: "arc_chain",
    title: "雷鏈增幅",
    text: "電弧鏈鎖次數 +1",
    apply(state) {
      state.player.arcChains += 1;
    },
  },
  {
    id: "crit",
    title: "臨界瞄準",
    text: "暴擊率 +8%，暴擊傷害 +20%",
    apply(state) {
      state.player.critChance = clamp(state.player.critChance + 0.08, 0, 0.65);
      state.player.critMultiplier += 0.2;
    },
  },
  {
    id: "resist",
    title: "反應裝甲",
    text: "減傷 +7%",
    apply(state) {
      state.player.damageResist = clamp(state.player.damageResist + 0.07, 0, 0.55);
    },
  },
  {
    id: "ult_engine",
    title: "終焉迴路",
    text: "終極充能效率 +28%",
    apply(state) {
      state.player.ultGainMultiplier *= 1.28;
    },
  },
  {
    id: "score_amp",
    title: "星核擷取",
    text: "分數與星核收益 +16%",
    apply(state) {
      state.player.scoreMultiplier *= 1.16;
      state.player.coreMultiplier *= 1.16;
    },
  },
];

const WAVE_BOONS = [
  {
    id: "supply",
    title: "補給艙抵達",
    text: "生命、護盾、能量回滿，炸彈 +1",
    apply(state) {
      const p = state.player;
      p.hp = p.maxHp;
      p.shield = p.maxShield;
      p.energy = p.maxEnergy;
      p.bombs = Math.min(p.maxBombs, p.bombs + 1);
    },
  },
  {
    id: "fusion",
    title: "核熔協議",
    text: "傷害 +15%，射速 +10%",
    apply(state) {
      state.player.damageMultiplier *= 1.15;
      state.player.fireRateMultiplier *= 0.9;
    },
  },
  {
    id: "quantum",
    title: "量子折返",
    text: "獲得一次復甦，並恢復 30% 生命",
    apply(state) {
      state.player.revives += 1;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.player.maxHp * 0.3);
    },
  },
  {
    id: "core_rain",
    title: "星核暴雨",
    text: "立即獲得大量星核與終極充能",
    apply(state) {
      state.runCores += Math.floor((36 + state.wave * 7) * state.player.coreMultiplier);
      state.player.ultCharge = clamp(state.player.ultCharge + 40, 0, 100);
    },
  },
  {
    id: "calm",
    title: "靜滅矩陣",
    text: "子彈時間耗能 -25%，衝刺冷卻 -12%",
    apply(state) {
      state.player.slowDrain *= 0.75;
      state.player.dashCooldown *= 0.88;
    },
  },
];

const CHAPTER_MAP = [
  {
    id: "chapter_1",
    code: "S-01",
    name: "序章：灰燼甦醒",
    desc: "裂隙剛開，敵潮還在試探，適合建立第一套流派。",
    waveBoost: 0,
    enemyHpFactor: 1,
    spawnFactor: 1,
    anomalyFactor: 1,
    directorBase: 1,
    npcFaction: "曙光議會",
  },
  {
    id: "chapter_2",
    code: "S-07",
    name: "鏡城偏移區",
    desc: "重力井頻繁出現，機動壓力顯著上升。",
    waveBoost: 1,
    enemyHpFactor: 1.08,
    spawnFactor: 1.09,
    anomalyFactor: 1.25,
    directorBase: 1.05,
    npcFaction: "深空行會",
  },
  {
    id: "chapter_3",
    code: "S-12",
    name: "黑井星團前線",
    desc: "精英密度極高，戰場節奏偏快且殘酷。",
    waveBoost: 2,
    enemyHpFactor: 1.14,
    spawnFactor: 1.14,
    anomalyFactor: 1.05,
    directorBase: 1.12,
    npcFaction: "灰燼機巧",
  },
  {
    id: "chapter_4",
    code: "S-19",
    name: "潮汐穹頂裂帶",
    desc: "事件觸發頻率大幅上升，獎勵與風險同步拉高。",
    waveBoost: 3,
    enemyHpFactor: 1.2,
    spawnFactor: 1.18,
    anomalyFactor: 1.32,
    directorBase: 1.18,
    npcFaction: "曙光議會",
  },
  {
    id: "chapter_5",
    code: "S-28",
    name: "終焉穹環",
    desc: "首領將以多階段姿態出現，戰場進入高壓狀態。",
    waveBoost: 4,
    enemyHpFactor: 1.28,
    spawnFactor: 1.24,
    anomalyFactor: 1.4,
    directorBase: 1.26,
    npcFaction: "深空行會",
  },
];

const TECH_TREE_NODES = [
  {
    id: "tech_core_io",
    name: "核心 I/O",
    desc: "永久 +8% 分數收益",
    cost: 420,
    requires: [],
    apply(player) {
      player.scoreMultiplier *= 1.08;
    },
  },
  {
    id: "tech_shield_sync",
    name: "護盾同步",
    desc: "永久 +10 護盾、+1/s 再生",
    cost: 480,
    requires: [],
    apply(player) {
      player.maxShield += 10;
      player.shield += 10;
      player.shieldRegen += 1;
    },
  },
  {
    id: "tech_flux_drive",
    name: "躍遷驅動",
    desc: "永久 -10% 衝刺冷卻",
    cost: 520,
    requires: [],
    apply(player) {
      player.dashCooldown *= 0.9;
    },
  },
  {
    id: "tech_heat_sink",
    name: "熱熔散逸",
    desc: "永久 +6% 射速",
    cost: 560,
    requires: ["tech_core_io"],
    apply(player) {
      player.fireRateMultiplier *= 0.94;
    },
  },
  {
    id: "tech_hyper_cell",
    name: "超流電池",
    desc: "永久 +10 能量上限、+2 回充",
    cost: 620,
    requires: ["tech_flux_drive"],
    apply(player) {
      player.maxEnergy += 10;
      player.energy += 10;
      player.energyRegen += 2;
    },
  },
  {
    id: "tech_battle_mind",
    name: "戰術心智",
    desc: "永久 +5% 暴擊率",
    cost: 700,
    requires: ["tech_heat_sink"],
    apply(player) {
      player.critChance = clamp(player.critChance + 0.05, 0, 0.8);
    },
  },
  {
    id: "tech_resonance",
    name: "共振裝甲",
    desc: "永久 +6% 減傷",
    cost: 760,
    requires: ["tech_shield_sync"],
    apply(player) {
      player.damageResist = clamp(player.damageResist + 0.06, 0, 0.65);
    },
  },
  {
    id: "tech_ult_relay",
    name: "終極中繼",
    desc: "永久 +12% 終極充能效率",
    cost: 820,
    requires: ["tech_hyper_cell"],
    apply(player) {
      player.ultGainMultiplier *= 1.12;
    },
  },
  {
    id: "tech_nanite",
    name: "納米維生",
    desc: "永久每秒恢復 1 生命",
    cost: 900,
    requires: ["tech_resonance"],
    apply(player) {
      player.hpRegen = (player.hpRegen || 0) + 1;
    },
  },
  {
    id: "tech_vanguard",
    name: "先鋒通道",
    desc: "永久 +5% 移速",
    cost: 980,
    requires: ["tech_battle_mind"],
    apply(player) {
      player.speed *= 1.05;
    },
  },
];

const TECH_NODE_NAME_BY_ID = TECH_TREE_NODES.reduce((map, node) => {
  map[node.id] = node.name;
  return map;
}, {});

const FACTION_NPCS = {
  曙光議會: [
    { name: "艾拉指揮官", tone: "冷靜" },
    { name: "雷奧執行官", tone: "果斷" },
    { name: "米亞觀測員", tone: "理性" },
  ],
  深空行會: [
    { name: "伊文航長", tone: "老練" },
    { name: "赫敏情報官", tone: "敏銳" },
    { name: "索恩策士", tone: "沉著" },
  ],
  灰燼機巧: [
    { name: "K-7 工程長", tone: "機械" },
    { name: "盧卡修復師", tone: "硬派" },
    { name: "薇爾鑄造官", tone: "激進" },
  ],
};

const ACHIEVEMENT_DEFS = [
  {
    id: "ach_first_blood",
    title: "初次淨場",
    desc: "達成 80 擊殺",
    rewardCores: 120,
    check: (state) => state.stats.kills >= 80,
  },
  {
    id: "ach_combo",
    title: "連段主宰",
    desc: "連段達到 24",
    rewardCores: 180,
    check: (state) => state.stats.highestCombo >= 24,
  },
  {
    id: "ach_boss_hunter",
    title: "首領獵手",
    desc: "單局擊破 3 名首領",
    rewardCores: 260,
    check: (state) => state.stats.bossKills >= 3,
  },
  {
    id: "ach_story",
    title: "命運執筆者",
    desc: "完成 6 次劇情節點選擇",
    rewardCores: 220,
    check: (state) => state.stats.storyChoices >= 6,
  },
  {
    id: "ach_explorer",
    title: "章節拓荒者",
    desc: "在第 4 章以上完成一次戰局",
    rewardCores: 300,
    check: (state) => (state.chapter?.index || 0) >= 3 && state.phase === "gameover",
  },
  {
    id: "ach_relic",
    title: "遺物收藏家",
    desc: "單局完成 5 次遺物事件",
    rewardCores: 200,
    check: (state) => state.stats.relicEvents >= 5,
  },
  {
    id: "ach_surgeon",
    title: "極限操盤",
    desc: "在血量低於 20% 狀態擊殺 50 敵人",
    rewardCores: 280,
    check: (state) => state.stats.clutchKills >= 50,
  },
  {
    id: "ach_eternity",
    title: "永恆波次",
    desc: "達到第 20 波",
    rewardCores: 420,
    check: (state) => state.wave >= 20,
  },
];

const FUNNY_MOMENTS = [
  {
    title: "戰地咖啡車漂移過境",
    color: "#ffd8a8",
    dialogue: "臨時補給：拿鐵加三倍濃縮。副作用是你會想挑戰首領。",
    apply(activeState) {
      activeState.player.energy = Math.min(activeState.player.maxEnergy, activeState.player.energy + 34);
      activeState.score += 180;
    },
  },
  {
    title: "宇宙貓踏過控制台",
    color: "#ffc9ff",
    dialogue: "貓咪已替你按下 17 個鍵。別問，先輸出就對了。",
    apply(activeState) {
      activeState.player.ultCharge = clamp(activeState.player.ultCharge + 16, 0, 100);
      activeState.runCores += 6;
    },
  },
  {
    title: "內鬼廣播誤開麥",
    color: "#b8e7ff",
    dialogue: "前線聽到敵軍在吵晚餐要吃什麼，火力下降 8 秒。",
    apply(activeState) {
      activeState.directorThreat = clamp(activeState.directorThreat - 0.12, 0.9, 3.2);
      activeState.player.damageResist = clamp(activeState.player.damageResist + 0.02, 0, 0.7);
    },
  },
  {
    title: "保全機器人跳廣場舞",
    color: "#c6ffd0",
    dialogue: "敵軍步伐被打亂。你現在的移動速度看起來超有節奏。",
    apply(activeState) {
      activeState.player.speed = Math.min(activeState.player.speed * 1.04, 420);
      activeState.player.energy = Math.min(activeState.player.maxEnergy, activeState.player.energy + 20);
    },
  },
  {
    title: "戰術 AI 發錯迷因包",
    color: "#ffe29c",
    dialogue: "整個頻道都在笑，連你的護盾都笑到回滿一截。",
    apply(activeState) {
      activeState.player.shield = Math.min(activeState.player.maxShield, activeState.player.shield + 24);
      activeState.player.hp = Math.min(activeState.player.maxHp, activeState.player.hp + 10);
    },
  },
];

const FUNNY_SPEAKERS = ["戰地脫口秀 AI", "前線吐槽員", "匿名補給員", "宇宙綜藝台"];

const input = {
  keys: new Set(),
  justPressed: new Set(),
  mouse: {
    x: WORLD_WIDTH * 0.5,
    y: WORLD_HEIGHT * 0.5,
    down: false,
    inside: false,
  },
  touch: {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false,
    slow: false,
  },
  touchAimPointerId: null,
  queuedDash: false,
  queuedBomb: false,
  queuedUlt: false,
};

let state = createState();
let lastTime = performance.now();

bindEvents();
showStartOverlay();
requestAnimationFrame(loop);

function createState() {
  const highScore = loadNumber(STORAGE_KEYS.highScore, 0);
  const bestWave = loadNumber(STORAGE_KEYS.bestWave, 0);
  const profile = loadProfile();
  const totalCores = profile.cores;
  const availableWeapons = [...new Set(profile.unlockedWeapons)].filter((id) => WEAPONS[id]);
  const selectedChapter = CHAPTER_MAP.find((chapter) => chapter.id === profile.selectedChapter) || CHAPTER_MAP[0];

  return {
    rng: mulberry32((Date.now() & 0xffffffff) >>> 0),
    phase: "start",
    pausedReason: "",
    score: 0,
    highScore,
    wave: 1,
    bestWave,
    combo: 0,
    comboTimer: 0,
    timeScale: 1,
    cameraShake: 0,
    waveBannerTimer: 0,
    spawnQueue: [],
    spawnCooldown: 0,
    waveClearDelay: -1,
    classId: null,
    runCores: 0,
    totalCores,
    profile,
    availableWeapons,
    chapter: { ...selectedChapter, index: CHAPTER_MAP.findIndex((c) => c.id === selectedChapter.id) },
    storyCursor: profile.storyCursor,
    loreCursor: profile.loreCursor,
    lorePulseTimer: 8.5,
    npcDialogueQueue: [],
    dialogueTimer: 0,
    achievementSet: new Set(profile.achievements || []),
    supportCd: 0,
    supportCharges: 0,
    relicEventCooldown: randRange(Math.random, 22, 36),
    relicBuffs: [],
    directorThreat: selectedChapter.directorBase,
    eliteSurgeTimer: randRange(Math.random, 18, 24),
    chapterEventCooldown: randRange(Math.random, 16, 26),
    factionRep: {
      曙光議會: profile.factionRep.曙光議會,
      深空行會: profile.factionRep.深空行會,
      灰燼機巧: profile.factionRep.灰燼機巧,
    },
    metaLevel: Math.min(30, Math.floor(totalCores / 360)),
    mission: null,
    missionCooldown: 4,
    missionSafeTimer: 0,
    worldEvent: null,
    worldEventCooldown: randRange(Math.random, 16, 24),
    comedyCooldown: randRange(Math.random, 12, 20),
    eventMultiplier: {
      score: 1,
      pickup: 0,
    },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    pickups: [],
    anomalies: [],
    anomalyTimer: 6.8,
    meteors: [],
    particles: [],
    toasts: [],
    feedDirty: true,
    choiceQueue: [],
    pendingChoice: null,
    ultimateFlash: 0,
    stats: {
      kills: 0,
      eliteKills: 0,
      bossKills: 0,
      damageDealt: 0,
      damageTaken: 0,
      pickups: 0,
      missions: 0,
      highestCombo: 0,
      storyChoices: 0,
      relicEvents: 0,
      clutchKills: 0,
      funnyMoments: 0,
    },
    player: createBasePlayer(totalCores, profile),
  };
}

function createBasePlayer(totalCores, profile) {
  const p = {
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    r: 13,
    speed: 262,
    hp: 100,
    maxHp: 100,
    shield: 50,
    maxShield: 50,
    shieldRegen: 7,
    shieldBreakDelay: 0,
    energy: 100,
    maxEnergy: 100,
    energyRegen: 24,
    hpRegen: 0,
    fireCd: 0,
    fireRateMultiplier: 1,
    weapon: "pulse",
    damageMultiplier: 1,
    scoreMultiplier: 1,
    coreMultiplier: 1,
    xp: 0,
    level: 1,
    xpToNext: 120,
    dashCd: 0,
    dashCooldown: 3.4,
    dashTime: 0,
    dashVx: 0,
    dashVy: 0,
    dashCost: 22,
    bombs: 2,
    maxBombs: 2,
    bombCd: 0,
    bombCooldown: 6.2,
    slowDrain: 40,
    overdriveTimer: 0,
    invuln: 0,
    damageResist: 0,
    facing: 0,
    droneLevel: 0,
    droneCd: 0,
    ultCharge: 0,
    ultGainMultiplier: 1,
    revives: 0,
    arcChains: 1,
    critChance: 0.06,
    critMultiplier: 1.8,
    lifeOnKill: 0,
    energyOnKill: 4,
    igniteTimer: 0,
    igniteCd: 14,
    supportPower: 1,
  };

  const metaLevel = Math.min(30, Math.floor(totalCores / 360));
  if (metaLevel > 0) {
    p.maxHp += metaLevel * 3;
    p.hp = p.maxHp;
    p.maxShield += Math.floor(metaLevel * 1.5);
    p.shield = p.maxShield;
    p.damageMultiplier *= 1 + metaLevel * 0.018;
    p.energyRegen += metaLevel * 0.6;
    p.scoreMultiplier *= 1 + metaLevel * 0.01;
    p.coreMultiplier *= 1 + metaLevel * 0.015;
  }

  const up = profile.metaUpgrades;
  const hpLv = up.meta_hp || 0;
  const shieldLv = up.meta_shield || 0;
  const damageLv = up.meta_damage || 0;
  const energyLv = up.meta_energy || 0;
  const coreLv = up.meta_core || 0;

  if (hpLv > 0) {
    p.maxHp += hpLv * 10;
    p.hp = p.maxHp;
  }
  if (shieldLv > 0) {
    p.maxShield += shieldLv * 8;
    p.shield = p.maxShield;
  }
  if (damageLv > 0) {
    p.damageMultiplier *= 1 + damageLv * 0.04;
  }
  if (energyLv > 0) {
    p.energyRegen += energyLv * 3;
  }
  if (coreLv > 0) {
    p.coreMultiplier *= 1 + coreLv * 0.05;
  }

  for (const techId of profile.techNodes || []) {
    const node = TECH_TREE_NODES.find((it) => it.id === techId);
    if (node && typeof node.apply === "function") {
      node.apply(p);
    }
  }

  return p;
}

function showStartOverlay() {
  showCommandHub();
}

function isStrategicOverlayAvailable() {
  return state.phase === "start" || state.phase === "paused";
}

function strategicBackAction() {
  if (state.phase === "paused") {
    return {
      label: "返回暫停選單",
      onClick: showPauseOverlay,
    };
  }
  return {
    label: "返回戰略中樞",
    onClick: showCommandHub,
  };
}

function showCommandHub() {
  const narrative = getNarrativeLine(state.loreCursor + state.totalCores + state.wave).slice(0, 76);
  showOverlay(
    "裂隙奔襲：戰略中樞",
    `永久星核：${state.totalCores}\n研究等級：${state.metaLevel}\n當前章節：${state.chapter.name}\n檔案脈絡：${narrative}`,
    [
      {
        label: "開始戰役（職業部署）",
        onClick: showClassSelectionOverlay,
      },
      {
        label: "章節星圖（選擇戰役章節）",
        onClick: showChapterMapOverlay,
      },
      {
        label: "星核軍械庫（購買武器 / 永久升級）",
        onClick: showArmoryOverlay,
      },
      {
        label: "局外科技樹（永久節點）",
        onClick: showTechTreeOverlay,
      },
      {
        label: "NPC 陣營通訊",
        onClick: showFactionCommOverlay,
      },
      {
        label: "編年史檔案庫（劇情脈絡）",
        onClick: showCodexOverlay,
      },
    ],
  );
}

function showChapterMapOverlay() {
  const actions = CHAPTER_MAP.map((chapter) => {
    const unlocked = (state.profile.chapterProgress[chapter.id] || 0) > 0 || chapter.id === CHAPTER_MAP[0].id;
    return {
      label: unlocked
        ? `部署 ${chapter.code}｜${chapter.name}｜${chapter.desc}`
        : `未解鎖 ${chapter.code}｜${chapter.name}（完成前章以解鎖）`,
      className: "upgrade-btn",
      onClick: () => {
        if (!unlocked) {
          pushFeed("此章節尚未解鎖。", "#ffaaaa");
          return;
        }
        state.profile.selectedChapter = chapter.id;
        state.chapter = { ...chapter, index: CHAPTER_MAP.findIndex((c) => c.id === chapter.id) };
        persistProfile();
        pushFeed(`章節已切換：${chapter.name}`, "#9fffd4");
        showChapterMapOverlay();
      },
    };
  });
  actions.push(strategicBackAction());

  showOverlay(
    "章節星圖",
    `目前章節：${state.chapter.name}（${state.chapter.code}）\n每個章節都會改變敵潮、事件、導演強度與劇情節奏。`,
    actions,
  );
}

function showTechTreeOverlay() {
  const actions = [];
  for (const node of TECH_TREE_NODES) {
    const unlocked = state.profile.techNodes.includes(node.id);
    const prereqReady = node.requires.every((id) => state.profile.techNodes.includes(id));
    const prereqNames = node.requires.map((id) => TECH_NODE_NAME_BY_ID[id] || "未知節點");
    actions.push({
      label: unlocked
        ? `已解鎖｜${node.name}｜${node.desc}`
        : prereqReady
          ? `研究 ${node.name}｜${node.cost} 星核｜${node.desc}`
          : `鎖定 ${node.name}｜需前置：${prereqNames.join("、")}`,
      className: "upgrade-btn",
      onClick: () => unlockTechNode(node),
    });
  }
  actions.push(strategicBackAction());

  showOverlay(
    "局外科技樹",
    `可用星核：${state.totalCores}\n已解鎖節點：${state.profile.techNodes.length}/${TECH_TREE_NODES.length}`,
    actions,
  );
}

function unlockTechNode(node) {
  if (state.profile.techNodes.includes(node.id)) {
    return;
  }
  const prereqReady = node.requires.every((id) => state.profile.techNodes.includes(id));
  if (!prereqReady) {
    pushFeed("前置節點尚未完成。", "#ffaaaa");
    return;
  }
  if (state.totalCores < node.cost) {
    pushFeed("星核不足，無法研究此節點。", "#ffaaaa");
    return;
  }

  state.totalCores -= node.cost;
  state.profile.cores = state.totalCores;
  state.profile.techNodes.push(node.id);
  persistProfile();
  pushFeed(`科技解鎖：${node.name}`, "#8dffd4");
  showTechTreeOverlay();
}

function showFactionCommOverlay() {
  const actions = Object.keys(FACTION_NPCS).map((faction) => {
    const npc = pickRandom(FACTION_NPCS[faction], state.rng);
    const rep = state.factionRep[faction] || 0;
    return {
      label: `連線 ${faction}（聲望 ${rep}）｜${npc.name}【${npc.tone}】`,
      className: "upgrade-btn",
      onClick: () => {
        queueDialogue(
          npc.name,
          `${faction}通訊：你在${state.chapter.name}的決策將改寫戰線，保持壓力，別讓裂隙喘息。`,
          4.8,
        );
        showFactionCommOverlay();
      },
    };
  });
  actions.push(strategicBackAction());
  showOverlay("NPC 陣營通訊", "選擇一個陣營開啟即時通訊。", actions);
}

function showClassSelectionOverlay() {
  const actions = Object.entries(CLASS_DEFS).map(([id, cls]) => ({
    label: `以【${cls.name}】出擊：${cls.desc}`,
    className: "upgrade-btn",
    onClick: () => startRun(id),
  }));
  actions.push({
    label: "返回戰略中樞",
    onClick: showCommandHub,
  });

  showOverlay(
    "職業部署",
    `選擇職業後進入戰場。已解鎖武器數：${state.availableWeapons.length}`,
    actions,
  );
}

function showArmoryOverlay() {
  const actions = [];
  const offerFlavor = ARMORY_CATALOG[(state.totalCores + state.storyCursor) % ARMORY_CATALOG.length];
  const relicFlavor = RELIC_CATALOG[(state.storyCursor + state.wave) % RELIC_CATALOG.length];

  actions.push(strategicBackAction());

  for (const offer of SHOP_WEAPON_OFFERS) {
    const owned = state.profile.unlockedWeapons.includes(offer.id);
    actions.push({
      label: owned
        ? `已持有｜${offer.name}（設為偏好）`
        : `購買 ${offer.name}｜${offer.cost} 星核｜${offer.desc}`,
      className: "upgrade-btn",
      onClick: () => purchaseWeaponUnlock(offer),
    });
  }

  for (const up of SHOP_META_UPGRADES) {
    const level = state.profile.metaUpgrades[up.id] || 0;
    const cost = Math.round(up.baseCost * (1 + level * 0.55));
    actions.push({
      label:
        level >= up.maxLevel
          ? `已滿級｜${up.name}`
          : `升級 ${up.name} Lv.${level}/${up.maxLevel}｜${cost} 星核｜${up.desc}`,
      className: "upgrade-btn",
      onClick: () => purchaseMetaUpgrade(up, cost),
    });
  }

  showOverlay(
    "星核軍械庫",
    `可用星核：${state.totalCores}\n軍械提要：${offerFlavor.name}｜${offerFlavor.description}\n遺物提要：${relicFlavor.name}｜${relicFlavor.lore}`,
    actions,
  );
}

function showCodexOverlay() {
  const arc = STORY_ARCS[state.storyCursor % STORY_ARCS.length];
  const codex = CODEX_ENTRIES[state.loreCursor % CODEX_ENTRIES.length];
  const logA = getNarrativeLine(state.loreCursor + 5);
  const logB = getNarrativeLine(state.loreCursor + 16);

  showOverlay(
    `編年史章節：${arc.chapter}`,
    `${arc.title}\n${arc.text}\n\n檔案：${codex.title}\n${codex.body}\n\n戰地紀錄：\n- ${logA}\n- ${logB}`,
    [
      {
        label: "下一頁檔案",
        onClick: () => {
          state.loreCursor += 1;
          state.profile.loreCursor = state.loreCursor;
          persistProfile();
          showCodexOverlay();
        },
      },
      {
        ...strategicBackAction(),
      },
    ],
  );
}

function getNarrativeLine(index) {
  if (NARRATIVE_FEED.length === 0) {
    return "訊號中斷，無可讀資料。";
  }
  const i = ((index % NARRATIVE_FEED.length) + NARRATIVE_FEED.length) % NARRATIVE_FEED.length;
  return NARRATIVE_FEED[i];
}

function purchaseWeaponUnlock(offer) {
  const owned = state.profile.unlockedWeapons.includes(offer.id);
  if (owned) {
    state.profile.favoriteWeapon = offer.id;
    persistProfile();
    pushFeed(`偏好武器已切換：${offer.name}`, "#9be8ff");
    showArmoryOverlay();
    return;
  }

  if (state.totalCores < offer.cost) {
    pushFeed("星核不足，無法完成購買。", "#ff9f9f");
    return;
  }

  state.totalCores -= offer.cost;
  state.profile.cores = state.totalCores;
  state.profile.unlockedWeapons.push(offer.id);
  state.profile.favoriteWeapon = offer.id;
  state.availableWeapons = [...new Set(state.profile.unlockedWeapons)].filter((id) => WEAPONS[id]);
  persistProfile();
  pushFeed(`武器已解鎖：${offer.name}`, "#8dffd4");
  showArmoryOverlay();
}

function purchaseMetaUpgrade(upgrade, cost) {
  const current = state.profile.metaUpgrades[upgrade.id] || 0;
  if (current >= upgrade.maxLevel) {
    return;
  }
  if (state.totalCores < cost) {
    pushFeed("星核不足，無法升級矩陣。", "#ff9f9f");
    return;
  }

  state.totalCores -= cost;
  state.profile.cores = state.totalCores;
  state.profile.metaUpgrades[upgrade.id] = current + 1;
  persistProfile();
  pushFeed(`已升級：${upgrade.name} -> Lv.${current + 1}`, "#8dffd4");
  showArmoryOverlay();
}

function persistProfile() {
  saveProfile(state.profile);
  saveNumber(STORAGE_KEYS.cores, state.profile.cores);
}

function startRun(classId) {
  state.classId = classId;
  const cls = CLASS_DEFS[classId];
  cls.apply(state.player);

  const chapter = state.chapter || CHAPTER_MAP[0];
  state.wave = 1 + chapter.waveBoost;
  state.directorThreat = chapter.directorBase;
  state.supportCharges = 1 + Math.floor((state.profile.techNodes || []).length / 4);
  state.player.supportPower = 1 + Math.floor((state.profile.techNodes || []).length / 3) * 0.12;
  state.player.damageMultiplier *= chapter.enemyHpFactor > 1.2 ? 1.06 : 1;

  const unlocked = [...new Set(state.profile.unlockedWeapons)].filter((id) => WEAPONS[id]);
  state.availableWeapons = unlocked.length > 0 ? unlocked : [...DEFAULT_UNLOCKED_WEAPONS];
  if (!state.availableWeapons.includes(state.player.weapon)) {
    state.player.weapon = state.profile.favoriteWeapon && state.availableWeapons.includes(state.profile.favoriteWeapon)
      ? state.profile.favoriteWeapon
      : state.availableWeapons[0];
  }

  state.phase = "running";
  state.mission = createMission(state);
  state.missionCooldown = 8;
  prepareWave(state);
  hideOverlay();

  pushFeed(`職業已啟動：${cls.name}`, "#7cf7ff");
  pushFeed(`章節部署：${chapter.code} ${chapter.name}`, "#b8d8ff");
  pushFeed(`戰役脈絡：${getNarrativeLine(state.loreCursor + state.wave)}`, "#d7d1ff");
  if (state.metaLevel > 0) {
    pushFeed(`研究等級加成生效：Lv.${state.metaLevel}`, "#ffdd8a");
  }

  const npc = pickRandom(FACTION_NPCS[chapter.npcFaction], state.rng);
  queueDialogue(
    npc.name,
    `${chapter.npcFaction}前線回報：${chapter.desc}，你已獲得戰場授權，立即推進。`,
    5.2,
  );
}

function restartGame() {
  state = createState();
  clearRuntimeInputState();
  showStartOverlay();
}

function clearRuntimeInputState() {
  input.keys.clear();
  input.justPressed.clear();
  input.mouse.down = false;
  input.mouse.inside = false;
  input.touch.up = false;
  input.touch.down = false;
  input.touch.left = false;
  input.touch.right = false;
  input.touch.fire = false;
  input.touch.slow = false;
  input.touchAimPointerId = null;
}

function prepareWave(activeState) {
  activeState.waveBannerTimer = 2;
  activeState.spawnQueue = buildWave(activeState.wave, activeState.rng);
  const chapterSpawn = activeState.chapter?.spawnFactor || 1;
  activeState.spawnCooldown = 0.28 / chapterSpawn;
  activeState.waveClearDelay = -1;
}

function buildWave(wave, rng) {
  const queue = [];
  const threatScale = 1 + (state.directorThreat - 1) * 0.8;
  const chapterScale = state.chapter?.spawnFactor || 1;
  const baseCount = Math.floor((7 + wave * 2) * threatScale * chapterScale);
  for (let i = 0; i < baseCount; i += 1) {
    queue.push(rollEnemyType(wave, rng));
  }

  if (wave % 3 === 0) {
    queue.push("tank");
  }
  if (wave % 4 === 0) {
    queue.push("assassin", "assassin");
  }
  if (wave % 5 === 0) {
    queue.push("boss");
  }

  shuffle(queue, rng);
  return queue;
}

function rollEnemyType(wave, rng) {
  const r = rng();

  if (wave < 3) {
    return r < 0.72 ? "chaser" : "shooter";
  }
  if (wave < 6) {
    if (r < 0.46) return "chaser";
    if (r < 0.72) return "shooter";
    if (r < 0.92) return "splitter";
    return "assassin";
  }

  if (r < 0.3) return "chaser";
  if (r < 0.54) return "shooter";
  if (r < 0.76) return "splitter";
  if (r < 0.9) return "assassin";
  return "tank";
}

function makeEnemy(activeState, type) {
  const t = ENEMY_TEMPLATES[type];
  const spawn = randomEdgeSpawn(activeState.rng);
  const hpScale = (1 + activeState.wave * 0.13) * (activeState.chapter?.enemyHpFactor || 1) * activeState.directorThreat;
  const speedScale = 1 + activeState.wave * 0.014 + (activeState.directorThreat - 1) * 0.08;

  const enemy = {
    type,
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    r: t.r,
    speed: t.speed * speedScale,
    hp: t.hp * hpScale,
    maxHp: t.hp * hpScale,
    damage: t.damage * (1 + activeState.wave * 0.028),
    score: t.score,
    xp: t.xp,
    color: t.color,
    fireCd: t.fireRate || 0,
    fireCdMax: t.fireRate || 0,
    phase: activeState.rng() * Math.PI * 2,
    burstCd: t.burstCooldown || 0,
    summonCd: 7,
    elite: null,
    explosiveDeath: false,
    pulseCd: 0,
    burning: 0,
    gravityTagged: 0,
    bossPhase: type === "boss" ? 1 : 0,
    phaseTransition: 0,
    phaseShiftLock: 0,
  };

  if (type !== "boss" && type !== "mini") {
    const eliteChance = clamp(0.05 + activeState.wave * 0.013, 0, 0.34);
    if (activeState.rng() < eliteChance) {
      const modId = pickRandom(Object.keys(ELITE_MODS), activeState.rng);
      const mod = ELITE_MODS[modId];
      enemy.elite = { id: modId, label: mod.label, color: mod.color };
      mod.apply(enemy);
    }
  }

  return enemy;
}

function randomEdgeSpawn(rng) {
  const margin = 24;
  const side = Math.floor(rng() * 4);

  if (side === 0) return { x: randRange(rng, margin, WORLD_WIDTH - margin), y: -20 };
  if (side === 1) return { x: WORLD_WIDTH + 20, y: randRange(rng, margin, WORLD_HEIGHT - margin) };
  if (side === 2) return { x: randRange(rng, margin, WORLD_WIDTH - margin), y: WORLD_HEIGHT + 20 };
  return { x: -20, y: randRange(rng, margin, WORLD_HEIGHT - margin) };
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  update(dt);
  render(now * 0.001);
  syncHud();

  input.justPressed.clear();
  requestAnimationFrame(loop);
}

function update(dt) {
  updateToasts(state, dt);
  updateParticles(state, dt);
  updateDialogue(dt);

  if (state.phase !== "running") {
    return;
  }

  const player = state.player;
  player.fireCd = Math.max(0, player.fireCd - dt);
  player.dashCd = Math.max(0, player.dashCd - dt);
  player.bombCd = Math.max(0, player.bombCd - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.droneCd = Math.max(0, player.droneCd - dt);
  player.igniteCd = Math.max(0, player.igniteCd - dt);
  player.igniteTimer = Math.max(0, player.igniteTimer - dt);
  state.supportCd = Math.max(0, state.supportCd - dt);

  state.ultimateFlash = Math.max(0, state.ultimateFlash - dt * 2.5);

  if (player.shield < player.maxShield) {
    if (player.shieldBreakDelay > 0) {
      player.shieldBreakDelay -= dt;
    } else {
      player.shield = Math.min(player.maxShield, player.shield + player.shieldRegen * dt);
    }
  }

  const wantsSlow = isKeyHeld("q") || input.touch.slow;
  if (wantsSlow && player.energy > 1.5) {
    state.timeScale = 0.47;
    player.energy = Math.max(0, player.energy - player.slowDrain * dt);
  } else {
    state.timeScale = 1;
  }

  player.energy = Math.min(player.maxEnergy, player.energy + player.energyRegen * dt);
  if (player.hpRegen > 0) {
    player.hp = Math.min(player.maxHp, player.hp + player.hpRegen * dt);
  }
  state.missionSafeTimer += dt;

  state.lorePulseTimer -= dt;
  if (state.lorePulseTimer <= 0) {
    state.lorePulseTimer = randRange(state.rng, 7.5, 12.5);
    state.loreCursor += 1;
    state.profile.loreCursor = state.loreCursor;
    persistProfile();
    pushFeed(`戰場脈絡：${getNarrativeLine(state.loreCursor)}`, "#cfc3ff");
  }

  updatePlayerMovement(state, dt);
  updatePlayerActions(state);

  const worldDt = dt * state.timeScale;
  updateSpawning(state, worldDt);
  updateEnemies(state, worldDt);
  updateBullets(state, worldDt);
  updateEnemyBullets(state, worldDt);
  updatePickups(state, worldDt);
  updateAnomalies(state, worldDt);
  updateMeteors(state, worldDt);
  updateWorldEvent(state, dt);
  updateChapterEvents(state, dt);
  updateRelicEvents(state, dt);
  updateThreatDirector(state, dt);
  updateMission(state, dt);
  updateCombo(state, dt);
  updateAchievements(state);
  updateComedyMoments(state, dt);

  if (
    state.spawnQueue.length === 0 &&
    state.enemies.length === 0 &&
    state.waveClearDelay < 0
  ) {
    state.waveClearDelay = 1.15;
  }

  if (state.waveClearDelay >= 0) {
    state.waveClearDelay -= dt;
    if (state.waveClearDelay <= 0) {
      onWaveCleared();
    }
  }

  if (state.waveBannerTimer > 0) {
    state.waveBannerTimer -= dt;
  }

  state.cameraShake = Math.max(0, state.cameraShake - dt * 6.4);
}

function updatePlayerMovement(activeState, dt) {
  const player = activeState.player;

  let mx = 0;
  let my = 0;

  if (isKeyHeld("w") || isKeyHeld("arrowup") || input.touch.up) my -= 1;
  if (isKeyHeld("s") || isKeyHeld("arrowdown") || input.touch.down) my += 1;
  if (isKeyHeld("a") || isKeyHeld("arrowleft") || input.touch.left) mx -= 1;
  if (isKeyHeld("d") || isKeyHeld("arrowright") || input.touch.right) mx += 1;

  const len = Math.hypot(mx, my) || 1;
  mx /= len;
  my /= len;

  const moving = Math.abs(mx) + Math.abs(my) > 0;
  const speedBoost = player.igniteTimer > 0 ? 1.2 : 1;

  if (player.dashTime > 0) {
    player.dashTime -= dt;
    player.x += player.dashVx * dt;
    player.y += player.dashVy * dt;
  } else if (moving) {
    player.x += mx * player.speed * speedBoost * dt;
    player.y += my * player.speed * speedBoost * dt;
  }

  player.x = clamp(player.x, 18, WORLD_WIDTH - 18);
  player.y = clamp(player.y, 18, WORLD_HEIGHT - 18);

  if (input.mouse.inside) {
    player.facing = angleBetween(player.x, player.y, input.mouse.x, input.mouse.y);
  } else if (input.touch.fire && activeState.enemies.length > 0) {
    const target = findNearestEnemy(activeState, player.x, player.y);
    if (target) {
      player.facing = angleBetween(player.x, player.y, target.x, target.y);
    }
  } else if (moving) {
    player.facing = Math.atan2(my, mx);
  }
}

function updatePlayerActions(activeState) {
  const player = activeState.player;

  if (input.queuedDash || consumePress("shift")) {
    input.queuedDash = false;
    tryDash(activeState);
  }

  if (input.queuedBomb || consumePress("e")) {
    input.queuedBomb = false;
    tryBomb(activeState);
  }

  if (input.queuedUlt || consumePress("f")) {
    input.queuedUlt = false;
    tryUltimate(activeState);
  }
  if (consumePress("g")) {
    trySupportStrike(activeState);
  }

  const slots = activeState.availableWeapons.length > 0 ? activeState.availableWeapons : DEFAULT_UNLOCKED_WEAPONS;
  for (let i = 0; i < Math.min(slots.length, 9); i += 1) {
    if (consumePress(String(i + 1))) {
      player.weapon = slots[i];
      state.profile.favoriteWeapon = player.weapon;
      persistProfile();
    }
  }
  if (consumePress("0") && slots[9]) {
    player.weapon = slots[9];
    state.profile.favoriteWeapon = player.weapon;
    persistProfile();
  }
  if (consumePress("[")) {
    player.weapon = cycleOwnedWeapon(slots, player.weapon, -1);
    state.profile.favoriteWeapon = player.weapon;
    persistProfile();
  }
  if (consumePress("]")) {
    player.weapon = cycleOwnedWeapon(slots, player.weapon, 1);
    state.profile.favoriteWeapon = player.weapon;
    persistProfile();
  }

  const firing = input.mouse.down || isKeyHeld(" ") || isKeyHeld("space") || input.touch.fire;
  if (firing && player.fireCd <= 0) {
    firePlayerWeapon(activeState, player.facing);
  }

  if (player.droneLevel > 0 && player.droneCd <= 0 && activeState.enemies.length > 0) {
    const target = findNearestEnemy(activeState, player.x, player.y);
    if (target) {
      const angle = angleBetween(player.x, player.y, target.x, target.y);
      fireDrone(activeState, angle);
      player.droneCd = Math.max(0.48, 1.1 - player.droneLevel * 0.1);
    }
  }
}

function tryDash(activeState) {
  const player = activeState.player;
  if (player.dashCd > 0 || player.energy < player.dashCost) {
    return;
  }

  let mx = 0;
  let my = 0;
  if (isKeyHeld("w") || isKeyHeld("arrowup") || input.touch.up) my -= 1;
  if (isKeyHeld("s") || isKeyHeld("arrowdown") || input.touch.down) my += 1;
  if (isKeyHeld("a") || isKeyHeld("arrowleft") || input.touch.left) mx -= 1;
  if (isKeyHeld("d") || isKeyHeld("arrowright") || input.touch.right) mx += 1;

  let dirX = mx;
  let dirY = my;
  if (Math.hypot(dirX, dirY) < 0.01) {
    dirX = Math.cos(player.facing);
    dirY = Math.sin(player.facing);
  }
  const len = Math.hypot(dirX, dirY) || 1;
  dirX /= len;
  dirY /= len;

  player.dashVx = dirX * 930;
  player.dashVy = dirY * 930;
  player.dashTime = 0.13;
  player.dashCd = player.dashCooldown;
  player.energy -= player.dashCost;
  player.invuln = Math.max(player.invuln, 0.22);

  kickCamera(activeState, 1.3);
  emitHitSpark(activeState, player.x, player.y, "#8ef5ff", 14);
}

function tryBomb(activeState) {
  const player = activeState.player;
  if (player.bombCd > 0 || player.bombs <= 0) {
    return;
  }

  player.bombs -= 1;
  player.bombCd = player.bombCooldown;

  const radius = 188;
  const damage = 168 + activeState.wave * 10;

  for (let i = activeState.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = activeState.enemies[i];
    const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
    if (dist <= radius + enemy.r) {
      const ratio = 1 - clamp(dist / (radius + enemy.r), 0, 1);
      dealDamageToEnemy(activeState, enemy, damage * (0.4 + ratio * 0.8), "bomb");
      if (enemy.hp <= 0) {
        killEnemy(activeState, enemy, "bomb");
        activeState.enemies.splice(i, 1);
      }
    }
  }

  for (let i = activeState.enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = activeState.enemyBullets[i];
    if (Math.hypot(bullet.x - player.x, bullet.y - player.y) <= radius + 16) {
      activeState.enemyBullets.splice(i, 1);
    }
  }

  player.invuln = Math.max(player.invuln, 0.35);
  kickCamera(activeState, 2.6);
  emitRing(activeState, player.x, player.y, "#ffe16b");
  pushFeed("星爆炸彈啟動", "#ffe89a");
}

function tryUltimate(activeState) {
  const player = activeState.player;
  if (player.ultCharge < 100) {
    return;
  }

  player.ultCharge = 0;
  player.invuln = Math.max(player.invuln, 1.05);
  player.igniteTimer = Math.max(player.igniteTimer, 7.5);
  player.igniteCd = 24;

  for (let i = activeState.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = activeState.enemies[i];
    dealDamageToEnemy(activeState, enemy, 210 + activeState.wave * 16, "ultimate");
    if (enemy.hp <= 0) {
      killEnemy(activeState, enemy, "ultimate");
      activeState.enemies.splice(i, 1);
    }
  }

  activeState.enemyBullets.length = 0;
  activeState.ultimateFlash = 1;
  kickCamera(activeState, 3.2);
  emitRing(activeState, player.x, player.y, "#ff67d1");
  emitRing(activeState, player.x, player.y, "#7c90ff");
  pushFeed("終極技：焚界審判", "#ff9ae3");
}

function trySupportStrike(activeState) {
  if (activeState.supportCd > 0 || activeState.supportCharges <= 0) {
    return;
  }

  activeState.supportCharges -= 1;
  activeState.supportCd = 18;

  const target = findNearestEnemy(activeState, activeState.player.x, activeState.player.y);
  const tx = target ? target.x : activeState.player.x + Math.cos(activeState.player.facing) * 140;
  const ty = target ? target.y : activeState.player.y + Math.sin(activeState.player.facing) * 140;
  const radius = 170;
  const baseDamage = (180 + activeState.wave * 14) * activeState.player.supportPower;

  applyExplosionDamage(activeState, tx, ty, radius, baseDamage);
  for (let i = activeState.enemyBullets.length - 1; i >= 0; i -= 1) {
    const b = activeState.enemyBullets[i];
    if (Math.hypot(b.x - tx, b.y - ty) <= radius) {
      activeState.enemyBullets.splice(i, 1);
    }
  }

  const chapterFaction = activeState.chapter?.npcFaction || "曙光議會";
  const npc = pickRandom(FACTION_NPCS[chapterFaction], activeState.rng);
  queueDialogue(npc.name, "支援軌道打擊已到位，窗口只有 6 秒，立刻推進。", 3.8);
  pushFeed("支援指令：軌道打擊", "#ffd4a2");
}

function firePlayerWeapon(activeState, angle) {
  const player = activeState.player;
  const weapon = WEAPONS[player.weapon];

  for (let i = 0; i < weapon.count; i += 1) {
    const spread = weapon.count === 1
      ? randRange(activeState.rng, -weapon.spread, weapon.spread)
      : mapRange(i, 0, weapon.count - 1, -weapon.spread, weapon.spread);

    const a = angle + spread;
    const critRoll = activeState.rng();
    const isCrit = critRoll < player.critChance;

    const damageBoost = player.igniteTimer > 0 ? 1.35 : 1;
    const baseDamage = weapon.damage * player.damageMultiplier * damageBoost;
    const damage = isCrit ? baseDamage * player.critMultiplier : baseDamage;
    const explosiveRadius = weapon.type === "explosive" ? 108 : 0;
    const burnTime = weapon.type === "burn" ? 2.4 : 0;
    const gravityField = weapon.type === "gravity" ? 1 : 0;
    const echoBounces = weapon.type === "echo" ? 1 : 0;

    activeState.bullets.push({
      x: player.x + Math.cos(a) * (player.r + 4),
      y: player.y + Math.sin(a) * (player.r + 4),
      vx: Math.cos(a) * weapon.speed,
      vy: Math.sin(a) * weapon.speed,
      r: weapon.count > 1 ? 3 : 4,
      ttl: 1.25,
      damage,
      pierce: weapon.pierce,
      color: weapon.color,
      type: weapon.type,
      chainLeft: player.arcChains,
      explosiveRadius,
      burnTime,
      gravityField,
      echoBounces,
    });
  }

  emitHitSpark(activeState, player.x, player.y, weapon.color, 4);
  const igniteRateBoost = player.igniteTimer > 0 ? 0.84 : 1;
  player.fireCd = weapon.fireRate * player.fireRateMultiplier * igniteRateBoost;
}

function fireDrone(activeState, angle) {
  const player = activeState.player;
  const damage = (8 + player.droneLevel * 3) * player.damageMultiplier;

  activeState.bullets.push({
    x: player.x - Math.cos(angle) * 8,
    y: player.y - Math.sin(angle) * 8,
    vx: Math.cos(angle) * 730,
    vy: Math.sin(angle) * 730,
    r: 3,
    ttl: 1,
    damage,
    pierce: 0,
    color: "#7fffd1",
    type: "normal",
    chainLeft: 0,
  });
}

function updateSpawning(activeState, dt) {
  activeState.spawnCooldown -= dt;

  if (activeState.spawnQueue.length > 0 && activeState.spawnCooldown <= 0) {
    const type = activeState.spawnQueue.shift();
    activeState.enemies.push(makeEnemy(activeState, type));
    const chapterSpawn = activeState.chapter?.spawnFactor || 1;
    const threatPush = clamp(activeState.directorThreat, 1, 2.6);
    activeState.spawnCooldown = Math.max(0.08, (0.52 - activeState.wave * 0.014) / (chapterSpawn * threatPush));
  }
}

function updateEnemies(activeState, dt) {
  const player = activeState.player;

  for (let i = activeState.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = activeState.enemies[i];
    enemy.phase += dt;
    enemy.burning = Math.max(0, (enemy.burning || 0) - dt);
    enemy.gravityTagged = Math.max(0, (enemy.gravityTagged || 0) - dt);

    if (enemy.burning > 0) {
      enemy.hp -= (16 + activeState.wave * 0.9) * dt;
    }

    const speedFactor = enemy.gravityTagged > 0 ? 0.7 : 1;
    const moveSpeed = enemy.speed * speedFactor;

    if (enemy.type === "boss") {
      updateBoss(activeState, enemy, dt);
    } else {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;

      if (enemy.type === "shooter") {
        const desired = 235;
        const pull = dist > desired + 25 ? 1 : dist < desired - 25 ? -1 : 0;
        const strafe = Math.sin(enemy.phase * 2.35) * 0.5;
        enemy.vx = (nx * pull - ny * strafe) * moveSpeed;
        enemy.vy = (ny * pull + nx * strafe) * moveSpeed;

        enemy.fireCd -= dt;
        if (enemy.fireCd <= 0) {
          enemy.fireCd = Math.max(0.54, enemy.fireCdMax - activeState.wave * 0.02);
          const aim = angleBetween(enemy.x, enemy.y, player.x, player.y);
          spawnEnemyBullet(activeState, enemy, aim, 260, 11);
        }
      } else if (enemy.type === "assassin") {
        enemy.burstCd -= dt;
        if (enemy.burstCd <= 0) {
          enemy.burstCd = Math.max(1.35, 2.8 - activeState.wave * 0.05);
          enemy.vx = nx * moveSpeed * 3.1;
          enemy.vy = ny * moveSpeed * 3.1;
        } else {
          enemy.vx = nx * moveSpeed;
          enemy.vy = ny * moveSpeed;
        }
      } else {
        enemy.vx = nx * moveSpeed;
        enemy.vy = ny * moveSpeed;
      }

      if (enemy.elite && enemy.elite.id === "magnetic") {
        enemy.pulseCd -= dt;
        if (enemy.pulseCd <= 0) {
          enemy.pulseCd = 2.5;
          for (let b = 0; b < 8; b += 1) {
            const a = (Math.PI * 2 * b) / 8 + enemy.phase;
            spawnEnemyBullet(activeState, enemy, a, 180, 9);
          }
        }
      }
    }

    if (activeState.worldEvent && activeState.worldEvent.type === "gravity") {
      const gx = WORLD_WIDTH * 0.5 - enemy.x;
      const gy = WORLD_HEIGHT * 0.5 - enemy.y;
      const gl = Math.hypot(gx, gy) || 1;
      enemy.vx += (gx / gl) * 28;
      enemy.vy += (gy / gl) * 28;
    }

    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;
    enemy.x = clamp(enemy.x, -40, WORLD_WIDTH + 40);
    enemy.y = clamp(enemy.y, -40, WORLD_HEIGHT + 40);

    if (circleHit(player.x, player.y, player.r, enemy.x, enemy.y, enemy.r)) {
      damagePlayer(activeState, enemy.damage * 0.52);
      enemy.hp -= 20;
      kickCamera(activeState, 0.65);
    }

    if (enemy.hp <= 0) {
      killEnemy(activeState, enemy, "contact");
      activeState.enemies.splice(i, 1);
    }
  }
}

function updateBoss(activeState, enemy, dt) {
  const player = activeState.player;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
  if (enemy.bossPhase === 1 && hpRatio <= 0.66) {
    enemy.bossPhase = 2;
    enemy.phaseTransition = 2.6;
    enemy.phaseShiftLock = 0.8;
    enemy.fireCd = 0.25;
    queueDialogue("終焉核心", "第一封鎖層崩潰。相位切換，戰場模式升級。", 4.2);
    pushFeed("首領轉場：第二階段", "#ffb8f0");
  } else if (enemy.bossPhase === 2 && hpRatio <= 0.33) {
    enemy.bossPhase = 3;
    enemy.phaseTransition = 3.2;
    enemy.phaseShiftLock = 1.1;
    enemy.fireCd = 0.2;
    queueDialogue("終焉核心", "最終核心暴露。全部防線切至殲滅協定。", 4.6);
    pushFeed("首領轉場：最終階段", "#ffd0a3");
  }

  if (enemy.phaseTransition > 0) {
    enemy.phaseTransition -= dt;
    enemy.x += Math.sin(enemy.phase * 4) * 130 * dt;
    enemy.y += Math.cos(enemy.phase * 3) * 130 * dt;
    if (activeState.rng() < 0.22) {
      for (let i = 0; i < 14; i += 1) {
        const a = (Math.PI * 2 * i) / 14 + enemy.phase;
        spawnEnemyBullet(activeState, enemy, a, 180 + enemy.bossPhase * 24, 11 + enemy.bossPhase * 2);
      }
    }
  }

  const orbitAmp = enemy.bossPhase === 1 ? 260 : enemy.bossPhase === 2 ? 320 : 380;
  const tx = WORLD_WIDTH * 0.5 + Math.sin(enemy.phase * 0.66 + enemy.bossPhase) * orbitAmp;
  const ty = WORLD_HEIGHT * (enemy.bossPhase === 3 ? 0.36 : 0.28) + Math.cos(enemy.phase * 0.92) * (84 + enemy.bossPhase * 12);

  enemy.vx = (tx - enemy.x) * 0.56;
  enemy.vy = (ty - enemy.y) * 0.56;

  enemy.phaseShiftLock = Math.max(0, enemy.phaseShiftLock - dt);
  if (enemy.phaseShiftLock <= 0) {
    enemy.fireCd -= dt;
  }
  if (enemy.fireCd <= 0) {
    const phaseFire = enemy.bossPhase === 1 ? 0.52 : enemy.bossPhase === 2 ? 0.4 : 0.31;
    enemy.fireCd = Math.max(0.16, phaseFire - activeState.wave * 0.009);

    const aim = angleBetween(enemy.x, enemy.y, player.x, player.y);
    const spread = enemy.bossPhase === 1 ? 0.1 : enemy.bossPhase === 2 ? 0.14 : 0.18;
    const rows = enemy.bossPhase === 1 ? 5 : enemy.bossPhase === 2 ? 7 : 9;
    for (let i = -(rows >> 1); i <= (rows >> 1); i += 1) {
      spawnEnemyBullet(
        activeState,
        enemy,
        aim + i * spread,
        300 + enemy.bossPhase * 24,
        12 + enemy.bossPhase * 2,
      );
    }

    if (enemy.bossPhase >= 2 && activeState.rng() < 0.48) {
      for (let i = 0; i < 14 + enemy.bossPhase * 2; i += 1) {
        const a = (Math.PI * 2 * i) / (14 + enemy.bossPhase * 2) + enemy.phase * 0.45;
        spawnEnemyBullet(activeState, enemy, a, 210 + enemy.bossPhase * 16, 10 + enemy.bossPhase);
      }
    }
  }

  enemy.summonCd -= dt;
  const summonGap = enemy.bossPhase === 1 ? 6.6 : enemy.bossPhase === 2 ? 5.2 : 4.2;
  if (enemy.summonCd <= 0) {
    enemy.summonCd = summonGap;
    activeState.enemies.push(makeEnemy(activeState, activeState.rng() < 0.45 ? "assassin" : "shooter"));
    if (enemy.bossPhase >= 2) {
      activeState.enemies.push(makeEnemy(activeState, activeState.rng() < 0.5 ? "chaser" : "splitter"));
    }
  }
}

function spawnEnemyBullet(activeState, enemy, angle, speed, damage) {
  activeState.enemyBullets.push({
    x: enemy.x + Math.cos(angle) * (enemy.r + 4),
    y: enemy.y + Math.sin(angle) * (enemy.r + 4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: 4,
    ttl: 3.2,
    damage,
  });
}

function updateBullets(activeState, dt) {
  for (let i = activeState.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = activeState.bullets[i];

    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.ttl -= dt;

    if (bullet.echoBounces > 0) {
      if (bullet.x < 0 || bullet.x > WORLD_WIDTH) {
        bullet.vx *= -1;
        bullet.echoBounces -= 1;
        bullet.x = clamp(bullet.x, 0, WORLD_WIDTH);
      }
      if (bullet.y < 0 || bullet.y > WORLD_HEIGHT) {
        bullet.vy *= -1;
        bullet.echoBounces -= 1;
        bullet.y = clamp(bullet.y, 0, WORLD_HEIGHT);
      }
    }

    if (
      bullet.ttl <= 0 ||
      bullet.x < -60 ||
      bullet.x > WORLD_WIDTH + 60 ||
      bullet.y < -60 ||
      bullet.y > WORLD_HEIGHT + 60
    ) {
      activeState.bullets.splice(i, 1);
      continue;
    }

    let removed = false;

    for (let j = activeState.enemies.length - 1; j >= 0; j -= 1) {
      const enemy = activeState.enemies[j];
      if (!circleHit(bullet.x, bullet.y, bullet.r, enemy.x, enemy.y, enemy.r)) {
        continue;
      }

      dealDamageToEnemy(activeState, enemy, bullet.damage, "bullet");
      emitHitSpark(activeState, bullet.x, bullet.y, bullet.color, 7);

      if (bullet.burnTime > 0) {
        enemy.burning = Math.max(enemy.burning || 0, bullet.burnTime);
      }
      if (bullet.gravityField > 0) {
        enemy.gravityTagged = Math.max(enemy.gravityTagged || 0, 2.6);
        activeState.anomalies.push({
          x: bullet.x,
          y: bullet.y,
          r: 38,
          ttl: 3.8,
          vx: 0,
          vy: 0,
          phase: activeState.rng() * Math.PI * 2,
          spin: 3.2,
        });
      }
      if (bullet.explosiveRadius > 0) {
        applyExplosionDamage(
          activeState,
          bullet.x,
          bullet.y,
          bullet.explosiveRadius,
          bullet.damage * 0.72,
        );
      }

      if (bullet.type === "arc" && bullet.chainLeft > 0) {
        chainArcDamage(activeState, enemy, bullet.chainLeft, bullet.damage * 0.7, new Set([enemy]));
      }

      if (enemy.hp <= 0) {
        killEnemy(activeState, enemy, "bullet");
        activeState.enemies.splice(j, 1);
      }

      if (bullet.pierce > 0) {
        bullet.pierce -= 1;
      } else {
        activeState.bullets.splice(i, 1);
        removed = true;
      }
      break;
    }

    if (removed) {
      continue;
    }
  }
}

function chainArcDamage(activeState, sourceEnemy, chainLeft, damage, visited) {
  if (chainLeft <= 0 || damage <= 1) {
    return;
  }

  let nearest = null;
  let nearestDist = Infinity;

  for (const enemy of activeState.enemies) {
    if (visited.has(enemy)) {
      continue;
    }
    const dist = Math.hypot(enemy.x - sourceEnemy.x, enemy.y - sourceEnemy.y);
    if (dist < nearestDist && dist <= 200) {
      nearest = enemy;
      nearestDist = dist;
    }
  }

  if (!nearest) {
    return;
  }

  visited.add(nearest);
  dealDamageToEnemy(activeState, nearest, damage, "arc");
  emitBolt(activeState, sourceEnemy.x, sourceEnemy.y, nearest.x, nearest.y, "#95d2ff");

  if (nearest.hp <= 0) {
    const idx = activeState.enemies.indexOf(nearest);
    if (idx >= 0) {
      killEnemy(activeState, nearest, "arc");
      activeState.enemies.splice(idx, 1);
    }
  }

  chainArcDamage(activeState, nearest, chainLeft - 1, damage * 0.72, visited);
}

function applyExplosionDamage(activeState, x, y, radius, damage) {
  for (let i = activeState.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = activeState.enemies[i];
    const dist = Math.hypot(enemy.x - x, enemy.y - y);
    if (dist > radius + enemy.r) {
      continue;
    }

    const ratio = 1 - clamp(dist / (radius + enemy.r), 0, 1);
    dealDamageToEnemy(activeState, enemy, damage * (0.35 + ratio), "explosive");
    if (enemy.hp <= 0) {
      killEnemy(activeState, enemy, "explosive");
      activeState.enemies.splice(i, 1);
    }
  }

  emitRing(activeState, x, y, "#ffb27b");
}

function updateEnemyBullets(activeState, dt) {
  const player = activeState.player;

  for (let i = activeState.enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = activeState.enemyBullets[i];

    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.ttl -= dt;

    if (
      bullet.ttl <= 0 ||
      bullet.x < -40 ||
      bullet.x > WORLD_WIDTH + 40 ||
      bullet.y < -40 ||
      bullet.y > WORLD_HEIGHT + 40
    ) {
      activeState.enemyBullets.splice(i, 1);
      continue;
    }

    if (circleHit(bullet.x, bullet.y, bullet.r, player.x, player.y, player.r)) {
      damagePlayer(activeState, bullet.damage);
      emitHitSpark(activeState, bullet.x, bullet.y, "#ff9faf", 5);
      activeState.enemyBullets.splice(i, 1);
    }
  }
}

function updatePickups(activeState, dt) {
  const player = activeState.player;

  for (let i = activeState.pickups.length - 1; i >= 0; i -= 1) {
    const item = activeState.pickups[i];
    item.ttl -= dt;
    item.pulse += dt * 4;

    if (activeState.worldEvent && activeState.worldEvent.type === "gravity") {
      const gx = WORLD_WIDTH * 0.5 - item.x;
      const gy = WORLD_HEIGHT * 0.5 - item.y;
      const gl = Math.hypot(gx, gy) || 1;
      item.x += (gx / gl) * 18 * dt;
      item.y += (gy / gl) * 18 * dt;
    }

    if (item.ttl <= 0) {
      activeState.pickups.splice(i, 1);
      continue;
    }

    if (circleHit(player.x, player.y, player.r, item.x, item.y, item.r + 2)) {
      applyPickup(activeState, item.type);
      emitHitSpark(activeState, item.x, item.y, item.color, 14);
      activeState.pickups.splice(i, 1);
    }
  }
}

function updateAnomalies(activeState, dt) {
  activeState.anomalyTimer -= dt;
  if (activeState.anomalyTimer <= 0) {
    activeState.anomalyTimer = randRange(activeState.rng, 8, 12);
    spawnAnomaly(activeState);
  }

  for (let i = activeState.anomalies.length - 1; i >= 0; i -= 1) {
    const anomaly = activeState.anomalies[i];

    anomaly.ttl -= dt;
    anomaly.phase += dt * anomaly.spin;
    anomaly.x += anomaly.vx * dt;
    anomaly.y += anomaly.vy * dt;

    if (anomaly.x < anomaly.r || anomaly.x > WORLD_WIDTH - anomaly.r) anomaly.vx *= -1;
    if (anomaly.y < anomaly.r || anomaly.y > WORLD_HEIGHT - anomaly.r) anomaly.vy *= -1;

    const player = activeState.player;
    if (circleHit(player.x, player.y, player.r, anomaly.x, anomaly.y, anomaly.r * 0.78)) {
      damagePlayer(activeState, 22 * dt);
    }

    for (const enemy of activeState.enemies) {
      if (circleHit(enemy.x, enemy.y, enemy.r, anomaly.x, anomaly.y, anomaly.r * 0.75)) {
        enemy.hp -= 28 * dt;
      }
    }

    if (anomaly.ttl <= 0) {
      activeState.anomalies.splice(i, 1);
    }
  }
}

function spawnAnomaly(activeState) {
  activeState.anomalies.push({
    x: randRange(activeState.rng, 120, WORLD_WIDTH - 120),
    y: randRange(activeState.rng, 90, WORLD_HEIGHT - 90),
    r: randRange(activeState.rng, 34, 58),
    ttl: randRange(activeState.rng, 10, 16),
    vx: randRange(activeState.rng, -36, 36),
    vy: randRange(activeState.rng, -36, 36),
    phase: activeState.rng() * Math.PI * 2,
    spin: randRange(activeState.rng, 1.8, 3.6),
  });
}

function updateMeteors(activeState, dt) {
  for (let i = activeState.meteors.length - 1; i >= 0; i -= 1) {
    const meteor = activeState.meteors[i];
    meteor.ttl -= dt;

    if (meteor.ttl <= 0) {
      explodeMeteor(activeState, meteor);
      activeState.meteors.splice(i, 1);
    }
  }
}

function explodeMeteor(activeState, meteor) {
  const player = activeState.player;

  if (Math.hypot(player.x - meteor.x, player.y - meteor.y) <= meteor.r + player.r) {
    damagePlayer(activeState, 38);
  }

  for (let i = activeState.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = activeState.enemies[i];
    const dist = Math.hypot(enemy.x - meteor.x, enemy.y - meteor.y);
    if (dist <= meteor.r + enemy.r) {
      dealDamageToEnemy(activeState, enemy, 128 + activeState.wave * 6, "meteor");
      if (enemy.hp <= 0) {
        killEnemy(activeState, enemy, "meteor");
        activeState.enemies.splice(i, 1);
      }
    }
  }

  for (let i = activeState.enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = activeState.enemyBullets[i];
    if (Math.hypot(bullet.x - meteor.x, bullet.y - meteor.y) <= meteor.r) {
      activeState.enemyBullets.splice(i, 1);
    }
  }

  kickCamera(activeState, 1.7);
  emitRing(activeState, meteor.x, meteor.y, "#ffb16f");
}

function updateWorldEvent(activeState, dt) {
  if (activeState.worldEvent) {
    activeState.worldEvent.remaining -= dt;

    if (activeState.worldEvent.type === "meteor") {
      activeState.worldEvent.spawnCd -= dt;
      if (activeState.worldEvent.spawnCd <= 0) {
        activeState.worldEvent.spawnCd = 0.56;
        activeState.meteors.push({
          x: randRange(activeState.rng, 60, WORLD_WIDTH - 60),
          y: randRange(activeState.rng, 50, WORLD_HEIGHT - 50),
          r: randRange(activeState.rng, 36, 60),
          ttl: 0.95,
        });
      }
    }

    if (activeState.worldEvent.remaining <= 0) {
      pushFeed(`世界事件結束：${activeState.worldEvent.label}`, "#bed6ff");
      activeState.worldEvent = null;
      activeState.eventMultiplier.score = 1;
      activeState.eventMultiplier.pickup = 0;
      activeState.worldEventCooldown = randRange(activeState.rng, 18, 26);
    }

    return;
  }

  activeState.worldEventCooldown -= dt;
  if (activeState.worldEventCooldown <= 0) {
    startWorldEvent(activeState);
  }
}

function updateChapterEvents(activeState, dt) {
  activeState.chapterEventCooldown -= dt;
  if (activeState.chapterEventCooldown > 0) {
    return;
  }

  activeState.chapterEventCooldown = randRange(activeState.rng, 18, 30);
  const chapterId = activeState.chapter?.id || CHAPTER_MAP[0].id;

  if (chapterId === "chapter_2") {
    for (let i = 0; i < 2; i += 1) {
      spawnAnomaly(activeState);
    }
    queueDialogue("米亞觀測員", "鏡城重力透鏡開啟，異常體數量翻倍。", 4.1);
    pushFeed("章節事件：鏡像透鏡", "#a7cbff");
    return;
  }

  if (chapterId === "chapter_3") {
    activeState.enemies.push(makeEnemy(activeState, "assassin"));
    activeState.enemies.push(makeEnemy(activeState, "assassin"));
    queueDialogue("K-7 工程長", "黑井前線突襲隊進場，保持機動。", 4.1);
    pushFeed("章節事件：刺殺編隊", "#f3a5ff");
    return;
  }

  if (chapterId === "chapter_4") {
    activeState.worldEventCooldown = Math.min(activeState.worldEventCooldown, 2.2);
    queueDialogue("赫敏情報官", "潮汐穹頂的事件密度升高，隨時準備轉場。", 4);
    pushFeed("章節事件：脈衝風暴", "#ffd3aa");
    return;
  }

  if (chapterId === "chapter_5") {
    activeState.directorThreat = clamp(activeState.directorThreat + 0.12, 1, 3.2);
    activeState.enemies.push(makeEnemy(activeState, "tank"));
    queueDialogue("雷奧執行官", "終焉穹環增幅啟動，威脅等級提升。", 4.4);
    pushFeed("章節事件：終焉增幅", "#ffbfbf");
    return;
  }

  spawnAnomaly(activeState);
  pushFeed("章節事件：裂隙震盪", "#b9d5ff");
}

function updateRelicEvents(activeState, dt) {
  if (activeState.phase !== "running") {
    return;
  }

  activeState.relicEventCooldown -= dt;
  if (activeState.relicEventCooldown > 0) {
    return;
  }

  activeState.relicEventCooldown = randRange(activeState.rng, 32, 48);
  const start = Math.floor(activeState.rng() * Math.max(1, RELIC_CATALOG.length - 4));
  const options = RELIC_CATALOG.slice(start, start + 3);

  enqueueChoice({
    title: "遺物事件：裂隙遺產",
    text: "你在戰場中心發現古代遺物核心，選擇一件帶走。",
    options: options.map((relic) => ({
      title: relic.name,
      text: `${relic.lore}｜屬性 ${relic.bonusKey} +${relic.bonusValue}`,
      apply(s) {
        applyRelicBonus(s, relic);
      },
    })),
  });

  activeState.stats.relicEvents += 1;
  const npc = pickRandom(FACTION_NPCS[activeState.chapter?.npcFaction || "曙光議會"], activeState.rng);
  queueDialogue(npc.name, "掃描到遺物信號，務必在敵潮前完成取樣。", 4.1);
}

function applyRelicBonus(activeState, relic) {
  const p = activeState.player;
  const key = relic.bonusKey;
  const value = relic.bonusValue;
  activeState.relicBuffs.push(relic.id);

  if (key === "bonus_0") p.damageMultiplier *= 1 + value * 0.015;
  else if (key === "bonus_1") p.fireRateMultiplier *= Math.max(0.7, 1 - value * 0.012);
  else if (key === "bonus_2") p.maxHp += value * 5;
  else if (key === "bonus_3") p.maxShield += value * 4;
  else if (key === "bonus_4") p.energyRegen += value * 0.8;
  else if (key === "bonus_5") p.ultGainMultiplier *= 1 + value * 0.01;
  else if (key === "bonus_6") p.critChance = clamp(p.critChance + value * 0.01, 0, 0.8);
  else if (key === "bonus_7") p.coreMultiplier *= 1 + value * 0.01;
  else if (key === "bonus_8") p.scoreMultiplier *= 1 + value * 0.01;
  else if (key === "bonus_9") p.damageResist = clamp(p.damageResist + value * 0.01, 0, 0.7);
  else if (key === "bonus_10") {
    activeState.supportCharges += Math.max(1, Math.floor(value / 2));
  } else {
    p.arcChains += Math.max(1, Math.floor(value / 3));
  }

  p.hp = Math.min(p.maxHp, p.hp + 8 + value * 2);
  p.shield = Math.min(p.maxShield, p.shield + 6 + value * 2);
  p.energy = Math.min(p.maxEnergy, p.energy + 10 + value * 2);

  pushFeed(`遺物同調：${relic.name}`, "#a8ffe2");
}

function updateThreatDirector(activeState, dt) {
  const p = activeState.player;
  const hpRatio = p.hp / Math.max(1, p.maxHp);
  const comboFactor = 1 + Math.min(activeState.combo * 0.01, 0.45);
  const waveFactor = 1 + activeState.wave * 0.01;
  const hpFactor = hpRatio < 0.35 ? 0.94 : 1.02;
  const chapterBase = activeState.chapter?.directorBase || 1;

  const target = clamp(chapterBase * comboFactor * waveFactor * hpFactor, 0.9, 3.2);
  activeState.directorThreat += (target - activeState.directorThreat) * dt * 0.8;
  activeState.directorThreat = clamp(activeState.directorThreat, 0.9, 3.2);

  activeState.eliteSurgeTimer -= dt;
  if (activeState.eliteSurgeTimer <= 0 && activeState.directorThreat >= 1.8) {
    activeState.eliteSurgeTimer = randRange(activeState.rng, 16, 24);
    const surgeCount = 1 + Math.floor(activeState.directorThreat);
    for (let i = 0; i < surgeCount; i += 1) {
      const e = makeEnemy(activeState, pickRandom(["assassin", "splitter", "tank"], activeState.rng));
      e.elite = { id: "surge", label: "導演增幅", color: "#ffd6a7" };
      e.hp *= 1.25;
      e.maxHp *= 1.25;
      activeState.enemies.push(e);
    }
    pushFeed("導演事件：精英增幅潮", "#ffd2a9");
    queueDialogue("戰術導演", "觀測到玩家優勢，投放額外精英單位。", 3.8);
  }
}

function updateAchievements(activeState) {
  for (const ach of ACHIEVEMENT_DEFS) {
    if (activeState.achievementSet.has(ach.id)) {
      continue;
    }
    if (!ach.check(activeState)) {
      continue;
    }

    activeState.achievementSet.add(ach.id);
    activeState.profile.achievements = [...activeState.achievementSet];
    activeState.totalCores += ach.rewardCores;
    activeState.profile.cores = activeState.totalCores;
    persistProfile();
    pushFeed(`成就達成：${ach.title}（+${ach.rewardCores} 星核）`, "#b7ff9a");
    queueDialogue("戰役記錄儀", `成就解鎖「${ach.title}」：${ach.desc}`, 3.9);
  }
}

function updateComedyMoments(activeState, dt) {
  if (activeState.phase !== "running") {
    return;
  }

  activeState.comedyCooldown -= dt;
  if (activeState.comedyCooldown > 0) {
    return;
  }

  activeState.comedyCooldown = randRange(activeState.rng, 16, 28);
  if (activeState.rng() > 0.42) {
    return;
  }

  const moment = pickRandom(FUNNY_MOMENTS, activeState.rng);
  moment.apply(activeState);
  activeState.stats.funnyMoments += 1;

  const speaker = pickRandom(FUNNY_SPEAKERS, activeState.rng);
  pushFeed(`搞笑亂入：${moment.title}`, moment.color);
  queueDialogue(speaker, moment.dialogue, 4.1);
}

function startWorldEvent(activeState) {
  const events = [
    { type: "meteor", label: "流星獵場", duration: 14 },
    { type: "bounty", label: "獵殺紅利", duration: 16 },
    { type: "gravity", label: "重力井", duration: 13 },
  ];

  const picked = pickRandom(events, activeState.rng);
  const eventLore = pickRandom(EVENT_LIBRARY, activeState.rng);
  const eventNameRaw = eventLore?.name || "未知異常";
  const eventName = eventNameRaw.replace(/^事件-\d+-/u, "") || "未知異常";
  const eventSummary = eventLore?.summary || "監測到異常訊號，請保持機動。";
  const scoreFactor = Number.isFinite(eventLore?.scoreFactor) ? eventLore.scoreFactor : 1;
  const pickupFactor = Number.isFinite(eventLore?.pickupFactor) ? eventLore.pickupFactor : 0;
  activeState.worldEvent = {
    type: picked.type,
    label: `${picked.label}｜${eventName}`,
    remaining: picked.duration,
    spawnCd: 0.3,
  };

  if (picked.type === "bounty") {
    activeState.eventMultiplier.score = 1.35 * scoreFactor;
    activeState.eventMultiplier.pickup = 0.22 + pickupFactor;
  } else {
    activeState.eventMultiplier.score = scoreFactor;
    activeState.eventMultiplier.pickup = pickupFactor;
  }

  pushFeed(`世界事件觸發：${picked.label}`, "#ffcb8a");
  pushFeed(`事件脈絡：${eventSummary}`, "#e8c9ff");
  const npc = pickRandom(FACTION_NPCS[activeState.chapter?.npcFaction || "曙光議會"], activeState.rng);
  queueDialogue(npc.name, `突發事件通報：${eventSummary}，注意場面正在失控。`, 4.4);
}

function updateMission(activeState, dt) {
  if (!activeState.mission) {
    activeState.missionCooldown -= dt;
    if (activeState.missionCooldown <= 0) {
      activeState.mission = createMission(activeState);
      pushFeed(`新任務：${activeState.mission.title}`, "#9be8ff");
    }
    return;
  }

  const mission = activeState.mission;
  if (mission.type === "survive") {
    mission.progress = Math.min(mission.target, activeState.missionSafeTimer);
  }

  if (mission.progress >= mission.target) {
    completeMission(activeState, mission);
  }
}

function createMission(activeState) {
  const contract = pickRandom(CONTRACT_LIBRARY, activeState.rng);
  const options = [
    {
      type: "kill",
      title: `殲滅協議｜${contract.title}`,
      target: 24 + activeState.wave * 3 + (contract.targetBias % 5),
      reward: { score: 900, cores: 22, ult: 20 },
      rewardText: `+900 分、+22 星核、終極 +20%｜${contract.briefing}`,
    },
    {
      type: "elite",
      title: `獵首行動｜${contract.title}`,
      target: Math.max(2, Math.floor(activeState.wave / 3) + 1 + (contract.targetBias % 2)),
      reward: { score: 1300, cores: 34, bombs: 1 },
      rewardText: `+1300 分、+34 星核、炸彈 +1｜${contract.briefing}`,
    },
    {
      type: "pickup",
      title: `資源搜集｜${contract.title}`,
      target: 7 + (contract.targetBias % 3),
      reward: { score: 700, cores: 26, heal: 35 },
      rewardText: `+700 分、+26 星核、回復 35 生命｜${contract.briefing}`,
    },
    {
      type: "survive",
      title: `零傷挑戰｜${contract.title}`,
      target: 14 + Math.floor(activeState.wave * 0.8) + (contract.targetBias % 4),
      reward: { score: 1100, cores: 30, ult: 30 },
      rewardText: `+1100 分、+30 星核、終極 +30%｜${contract.briefing}`,
    },
  ];

  const mission = { ...pickRandom(options, activeState.rng), progress: 0 };
  activeState.missionSafeTimer = 0;
  return mission;
}

function completeMission(activeState, mission) {
  const p = activeState.player;

  activeState.score += Math.round(mission.reward.score * p.scoreMultiplier);
  activeState.runCores += Math.round(mission.reward.cores * p.coreMultiplier);

  if (mission.reward.ult) {
    p.ultCharge = clamp(p.ultCharge + mission.reward.ult, 0, 100);
  }
  if (mission.reward.bombs) {
    p.bombs = Math.min(p.maxBombs, p.bombs + mission.reward.bombs);
  }
  if (mission.reward.heal) {
    p.hp = Math.min(p.maxHp, p.hp + mission.reward.heal);
  }

  activeState.stats.missions += 1;
  pushFeed(`任務完成：${mission.title}`, "#8cffb7");
  pushFeed(`合約後記：${getNarrativeLine(activeState.loreCursor + activeState.stats.missions * 3)}`, "#d8ccff");
  const npc = pickRandom(FACTION_NPCS[activeState.chapter?.npcFaction || "深空行會"], activeState.rng);
  queueDialogue(npc.name, `合約回報完成。獎勵已入帳，下一波更兇。`, 3.8);

  activeState.mission = null;
  activeState.missionCooldown = 6;
}

function updateCombo(activeState, dt) {
  if (activeState.comboTimer > 0) {
    activeState.comboTimer -= dt;
  } else {
    activeState.combo = 0;
  }

  if (activeState.combo >= 18 && activeState.player.igniteCd <= 0) {
    activeState.player.igniteTimer = 7;
    activeState.player.igniteCd = 26;
    pushFeed("連段突破：焚界模式啟動", "#ff98d8");
  }
}

function dealDamageToEnemy(activeState, enemy, amount, source) {
  enemy.hp -= amount;
  activeState.stats.damageDealt += amount;

  if (source === "arc") {
    emitHitSpark(activeState, enemy.x, enemy.y, "#9ec7ff", 5);
  }
}

function killEnemy(activeState, enemy) {
  const p = activeState.player;
  const comboMult = 1 + Math.min(activeState.combo * 0.07, 6);
  const finalScore = Math.round(
    enemy.score * comboMult * p.scoreMultiplier * activeState.eventMultiplier.score,
  );

  activeState.score += finalScore;
  activeState.combo += 1;
  activeState.comboTimer = 3.2;
  activeState.stats.highestCombo = Math.max(activeState.stats.highestCombo, activeState.combo);

  const xpGain = Math.round(enemy.xp * (1 + activeState.wave * 0.01));
  gainXp(activeState, xpGain);

  p.ultCharge = clamp(p.ultCharge + (enemy.type === "boss" ? 20 : 4) * p.ultGainMultiplier, 0, 100);
  p.energy = Math.min(p.maxEnergy, p.energy + p.energyOnKill);
  if (p.lifeOnKill > 0) {
    p.hp = Math.min(p.maxHp, p.hp + p.lifeOnKill);
  }

  activeState.stats.kills += 1;

  const baseCore = enemy.type === "boss" ? 38 : enemy.elite ? 7 : 3;
  activeState.runCores += Math.round(baseCore * p.coreMultiplier);

  if (enemy.elite) {
    activeState.stats.eliteKills += 1;
    onMissionProgress(activeState, "elite", 1);
    pushFeed(`精英擊破：${enemy.elite.label} ${enemy.type}`, enemy.elite.color);
  }
  if (enemy.type === "boss") {
    activeState.stats.bossKills += 1;
    pushFeed("首領已殲滅，戰場暫時淨空", "#fff1b3");
  }

  onMissionProgress(activeState, "kill", 1);

  if (enemy.type === "splitter") {
    for (let i = 0; i < 2; i += 1) {
      const mini = makeEnemy(activeState, "mini");
      mini.x = enemy.x + randRange(activeState.rng, -16, 16);
      mini.y = enemy.y + randRange(activeState.rng, -16, 16);
      mini.elite = null;
      activeState.enemies.push(mini);
    }
  }

  if (enemy.explosiveDeath) {
    emitRing(activeState, enemy.x, enemy.y, "#ffd885");
    const player = activeState.player;
    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 110) {
      damagePlayer(activeState, 16);
    }
  }

  const dropChance = clamp(0.17 + activeState.eventMultiplier.pickup, 0, 0.55);
  if (activeState.rng() < dropChance) {
    const roll = activeState.rng();
    let type = "energy";
    if (roll < 0.23) type = "health";
    else if (roll < 0.39) type = "bomb";
    else if (roll < 0.51) type = "shield";
    else if (roll > 0.88) type = "overdrive";

    spawnPickup(activeState, enemy.x, enemy.y, type);
  }

  if (activeState.score > activeState.highScore) {
    activeState.highScore = activeState.score;
  }

  emitHitSpark(activeState, enemy.x, enemy.y, enemy.elite ? enemy.elite.color : enemy.color, 16);
  kickCamera(activeState, enemy.type === "boss" ? 2.8 : 0.8);
}

function onMissionProgress(activeState, missionType, delta) {
  if (!activeState.mission) {
    return;
  }

  if (activeState.mission.type === missionType) {
    activeState.mission.progress += delta;
  }
}

function gainXp(activeState, amount) {
  const p = activeState.player;
  p.xp += amount;

  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    p.xpToNext = Math.round(p.xpToNext * 1.22 + 18);

    enqueueChoice({
      title: `等級提升 Lv.${p.level}`,
      text: "選擇一項神經矩陣強化",
      options: pickRandomUpgrades(TALENT_POOL, 3, activeState.rng),
    });

    pushFeed(`等級提升！Lv.${p.level}`, "#9dfec4");
  }
}

function onWaveCleared() {
  state.wave += 1;
  state.bestWave = Math.max(state.bestWave, state.wave);

  const arc = STORY_ARCS[state.storyCursor % STORY_ARCS.length];
  if (arc && state.wave % 2 === 0) {
    const factionNpc = pickRandom(FACTION_NPCS[state.chapter?.npcFaction || "曙光議會"], state.rng);
    queueDialogue(factionNpc.name, `劇情節點已開啟：${arc.title}，你的抉擇會永久改寫前線。`, 4.8);
    enqueueChoice({
      title: `劇情節點：${arc.title}`,
      text: `${arc.text}\n\nA. ${arc.optionA}\nB. ${arc.optionB}`,
      options: [
        {
          title: `方案 A（${arc.effectA.faction}）`,
          text: `${arc.optionA}`,
          apply(activeState) {
            applyStoryEffect(activeState, arc.effectA);
          },
        },
        {
          title: `方案 B（${arc.effectB.faction}）`,
          text: `${arc.optionB}`,
          apply(activeState) {
            applyStoryEffect(activeState, arc.effectB);
          },
        },
      ],
    });
    state.storyCursor += 1;
    state.profile.storyCursor = state.storyCursor;
    persistProfile();
  }

  enqueueChoice({
    title: `波次 ${state.wave - 1} 已清空`,
    text: "選擇一項波次增幅",
    options: pickRandomUpgrades(WAVE_BOONS, 3, state.rng),
  });

  prepareWave(state);
  pushFeed(`進入波次 ${state.wave}`, "#9ec9ff");
  pushFeed(`戰略紀錄：${getNarrativeLine(state.loreCursor + state.wave * 2)}`, "#c7c1ff");
}

function applyStoryEffect(activeState, effect) {
  const p = activeState.player;
  const scoreGain = Math.round((effect.score || 0) * p.scoreMultiplier);
  const coreGain = Math.round((effect.cores || 0) * p.coreMultiplier);

  activeState.score += scoreGain;
  activeState.runCores += coreGain;
  p.hp = Math.min(p.maxHp, p.hp + (effect.hp || 0));
  p.energy = Math.min(p.maxEnergy, p.energy + (effect.energy || 0));

  p.ultCharge = clamp(p.ultCharge + 6, 0, 100);

  if (effect.faction) {
    let key = effect.faction;
    if (!Object.prototype.hasOwnProperty.call(activeState.factionRep, key)) {
      const keys = Object.keys(activeState.factionRep);
      const mapped = Math.abs([...effect.faction].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % keys.length;
      key = keys[mapped];
    }
    activeState.factionRep[key] += effect.rep || 1;
    activeState.profile.factionRep = {
      曙光議會: activeState.factionRep.曙光議會,
      深空行會: activeState.factionRep.深空行會,
      灰燼機巧: activeState.factionRep.灰燼機巧,
    };
    persistProfile();
    effect = { ...effect, faction: key };
  }

  pushFeed(
    `劇情選擇生效：${effect.faction} 聲望 +${effect.rep || 1}｜分數 +${scoreGain}｜星核 +${coreGain}`,
    "#b9ffd8",
  );
  activeState.stats.storyChoices += 1;
  const npc = pickRandom(FACTION_NPCS[effect.faction || activeState.chapter?.npcFaction || "曙光議會"], activeState.rng);
  queueDialogue(npc.name, `已接收你的決策。戰線已向「${effect.faction || "未知陣營"}」偏轉。`, 4.2);
}

function enqueueChoice(choice) {
  state.choiceQueue.push(choice);
  if (state.phase === "running" && !state.pendingChoice) {
    openNextChoice();
  }
}

function openNextChoice() {
  if (state.choiceQueue.length === 0) {
    state.pendingChoice = null;
    if (state.phase === "choice") {
      state.phase = "running";
      hideOverlay();
    }
    return;
  }

  state.pendingChoice = state.choiceQueue.shift();
  state.phase = "choice";

  const actions = state.pendingChoice.options.map((option) => ({
    label: `${option.title}：${option.text}`,
    className: "upgrade-btn",
    onClick: () => {
      option.apply(state);
      pushFeed(`已選擇：${option.title}`, "#8fffd2");
      state.pendingChoice = null;
      openNextChoice();
    },
  }));

  showOverlay(state.pendingChoice.title, state.pendingChoice.text, actions);
}

function damagePlayer(activeState, amount) {
  const player = activeState.player;
  if (player.invuln > 0 || activeState.phase !== "running") {
    return;
  }

  activeState.stats.damageTaken += amount;
  activeState.missionSafeTimer = 0;

  let damage = amount * (1 - player.damageResist);

  if (player.shield > 0) {
    const absorbed = Math.min(player.shield, damage);
    player.shield -= absorbed;
    damage -= absorbed;

    if (absorbed > 0) {
      player.shieldBreakDelay = Math.max(player.shieldBreakDelay, 1.4);
    }
  }

  if (damage > 0) {
    player.hp -= damage;
  }

  player.invuln = 0.2;
  kickCamera(activeState, 1.1);
  emitHitSpark(activeState, player.x, player.y, "#ff7a94", 10);

  if (player.hp <= 0) {
    if (player.revives > 0) {
      player.revives -= 1;
      player.hp = Math.round(player.maxHp * 0.46);
      player.shield = Math.round(player.maxShield * 0.6);
      player.invuln = 1.2;
      pushFeed("復甦系統啟動，重返戰場", "#a9ffc8");
      return;
    }

    player.hp = 0;
    onGameOver();
  }
}

function onGameOver() {
  state.phase = "gameover";
  state.pendingChoice = null;
  state.choiceQueue.length = 0;

  state.bestWave = Math.max(state.bestWave, state.wave);
  const scoreCore = Math.floor(state.score / 1100);
  const waveCore = state.wave * 6;
  const earned = scoreCore + waveCore + state.runCores;

  state.totalCores += earned;
  state.runCores = earned;
  state.profile.cores = state.totalCores;
  state.profile.storyCursor = state.storyCursor;
  state.profile.loreCursor = state.loreCursor;
  state.profile.factionRep = {
    曙光議會: state.factionRep.曙光議會,
    深空行會: state.factionRep.深空行會,
    灰燼機巧: state.factionRep.灰燼機巧,
  };
  state.profile.achievements = [...state.achievementSet];
  const chapterId = state.chapter?.id || CHAPTER_MAP[0].id;
  state.profile.chapterProgress[chapterId] = Math.max(state.profile.chapterProgress[chapterId] || 0, state.wave);
  const chapterIdx = CHAPTER_MAP.findIndex((c) => c.id === chapterId);
  if (chapterIdx >= 0 && chapterIdx < CHAPTER_MAP.length - 1 && state.wave >= 8) {
    const nextChapter = CHAPTER_MAP[chapterIdx + 1];
    state.profile.chapterProgress[nextChapter.id] = Math.max(state.profile.chapterProgress[nextChapter.id] || 0, 1);
  }

  state.highScore = Math.max(state.highScore, Math.floor(state.score));

  saveNumber(STORAGE_KEYS.highScore, state.highScore);
  saveNumber(STORAGE_KEYS.cores, state.totalCores);
  saveNumber(STORAGE_KEYS.bestWave, state.bestWave);
  persistProfile();

  const summary = [
    `最終分數：${Math.floor(state.score)}`,
    `最高波次：${state.wave}`,
    `擊殺：${state.stats.kills}（精英 ${state.stats.eliteKills} / 首領 ${state.stats.bossKills}）`,
    `最高連段：${state.stats.highestCombo}`,
    `任務完成：${state.stats.missions}`,
    `解鎖武器數：${state.profile.unlockedWeapons.length}`,
    `派系聲望：曙光 ${state.factionRep.曙光議會} / 深空 ${state.factionRep.深空行會} / 灰燼 ${state.factionRep.灰燼機巧}`,
    `本局獲得星核：${earned}`,
    `永久星核總計：${state.totalCores}`,
  ].join("\n");

  showOverlay("訊號中斷", summary, [
    {
      label: "重新部署",
      onClick: restartGame,
    },
  ]);
}

function togglePause() {
  if (state.phase === "start" || state.phase === "gameover") {
    return;
  }

  if (state.phase === "choice") {
    return;
  }

  if (state.phase === "paused") {
    state.phase = "running";
    hideOverlay();
    return;
  }

  if (state.phase === "running") {
    state.phase = "paused";
    showPauseOverlay();
  }
}

function showPauseOverlay() {
  showOverlay("已暫停", "時流暫停中。", [
    {
      label: "繼續",
      onClick: togglePause,
    },
    {
      label: "章節星圖",
      onClick: showChapterMapOverlay,
    },
    {
      label: "星核軍械庫",
      onClick: showArmoryOverlay,
    },
    {
      label: "局外科技樹",
      onClick: showTechTreeOverlay,
    },
    {
      label: "NPC 陣營通訊",
      onClick: showFactionCommOverlay,
    },
    {
      label: "編年史檔案庫",
      onClick: showCodexOverlay,
    },
    {
      label: "重開",
      onClick: restartGame,
    },
  ]);
}

function openStrategicOverlay(openFn) {
  if (!isStrategicOverlayAvailable()) {
    return;
  }
  openFn();
}

function spawnPickup(activeState, x, y, type) {
  const defs = {
    health: { color: "#ff739a", r: 8 },
    energy: { color: "#57f7ff", r: 8 },
    bomb: { color: "#ffe26d", r: 9 },
    shield: { color: "#86b4ff", r: 8 },
    overdrive: { color: "#d895ff", r: 10 },
  };

  const d = defs[type];
  activeState.pickups.push({
    x,
    y,
    type,
    r: d.r,
    color: d.color,
    ttl: 14,
    pulse: activeState.rng() * Math.PI * 2,
  });
}

function applyPickup(activeState, type) {
  const p = activeState.player;
  activeState.stats.pickups += 1;
  onMissionProgress(activeState, "pickup", 1);

  if (type === "health") {
    p.hp = Math.min(p.maxHp, p.hp + 30);
    pushFeed("拾取：生命核心", "#ff9ab2");
    return;
  }
  if (type === "energy") {
    p.energy = Math.min(p.maxEnergy, p.energy + 44);
    pushFeed("拾取：能量核心", "#9af7ff");
    return;
  }
  if (type === "bomb") {
    p.bombs = Math.min(p.maxBombs, p.bombs + 1);
    pushFeed("拾取：炸彈補給", "#ffe8a4");
    return;
  }
  if (type === "shield") {
    p.shield = Math.min(p.maxShield, p.shield + 36);
    pushFeed("拾取：護盾晶片", "#a6c7ff");
    return;
  }
  if (type === "overdrive") {
    p.igniteTimer = Math.max(p.igniteTimer, 6.5);
    p.ultCharge = clamp(p.ultCharge + 15, 0, 100);
    pushFeed("拾取：超載晶核", "#e3a7ff");
  }
}

function render(time) {
  ctx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const shakeX = state.cameraShake > 0 ? randRange(state.rng, -4, 4) * state.cameraShake : 0;
  const shakeY = state.cameraShake > 0 ? randRange(state.rng, -4, 4) * state.cameraShake : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawBackground(time);
  drawMeteors(state.meteors);
  drawAnomalies(state.anomalies, time);
  drawPickups(state.pickups, time);
  drawBullets(state.bullets);
  drawEnemyBullets(state.enemyBullets);
  drawEnemies(state.enemies, time);
  drawPlayer(state.player, time);
  drawParticles(state.particles);

  if (state.waveBannerTimer > 0) {
    drawWaveBanner(state.wave);
  }

  drawCrosshair();
  drawEventOverlay();

  if (state.ultimateFlash > 0) {
    ctx.fillStyle = `rgba(255, 190, 245, ${0.18 * state.ultimateFlash})`;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  }

  ctx.restore();
}

function drawBackground(time) {
  const g = ctx.createLinearGradient(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  g.addColorStop(0, "#07112b");
  g.addColorStop(0.55, "#0a0f20");
  g.addColorStop(1, "#150824");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  const step = 34;
  const drift = (time * 28) % step;

  ctx.strokeStyle = "rgba(96, 171, 255, 0.1)";
  ctx.lineWidth = 1;

  for (let x = -step; x <= WORLD_WIDTH + step; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + drift, 0);
    ctx.lineTo(x + drift, WORLD_HEIGHT);
    ctx.stroke();
  }

  for (let y = -step; y <= WORLD_HEIGHT + step; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + drift * 0.58);
    ctx.lineTo(WORLD_WIDTH, y + drift * 0.58);
    ctx.stroke();
  }
}

function drawPlayer(player, time) {
  const pulse = 1 + Math.sin(time * 7.5) * 0.06;
  const r = player.r * pulse;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.facing);

  const auraColor = player.igniteTimer > 0 ? "rgba(255, 180, 110, 0.36)" : "rgba(90, 245, 255, 0.26)";
  ctx.fillStyle = auraColor;
  ctx.beginPath();
  ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = player.igniteTimer > 0 ? "#ffd069" : "#78f7ff";
  ctx.beginPath();
  ctx.moveTo(r + 10, 0);
  ctx.lineTo(-r, r * 0.78);
  ctx.lineTo(-r * 0.5, 0);
  ctx.lineTo(-r, -r * 0.78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#f2fbff";
  ctx.beginPath();
  ctx.arc(3, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  if (player.droneLevel > 0) {
    const count = Math.min(4, player.droneLevel);
    for (let i = 0; i < count; i += 1) {
      const a = time * 2.2 + (Math.PI * 2 * i) / count;
      const dist = 26 + player.droneLevel * 4;
      const dx = Math.cos(a) * dist;
      const dy = Math.sin(a) * dist;
      ctx.fillStyle = "#8fffd5";
      ctx.beginPath();
      ctx.arc(player.x + dx, player.y + dy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawEnemies(enemies, time) {
  for (const enemy of enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);

    if (enemy.type === "boss") {
      const spin = time * 0.8;
      ctx.rotate(spin);
      ctx.strokeStyle = "rgba(244, 247, 255, 0.96)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r + 11, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-spin * 2.2);
      ctx.strokeStyle = "rgba(255, 95, 198, 0.66)";
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r - 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r * 0.72, 0, Math.PI * 2);
      ctx.fill();
    } else if (enemy.type === "splitter") {
      ctx.rotate(time * 1.3);
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.moveTo(0, -enemy.r);
      ctx.lineTo(enemy.r, 0);
      ctx.lineTo(0, enemy.r);
      ctx.lineTo(-enemy.r, 0);
      ctx.closePath();
      ctx.fill();
    } else if (enemy.type === "shooter") {
      ctx.rotate(time * 0.66);
      ctx.fillStyle = enemy.color;
      ctx.fillRect(-enemy.r, -enemy.r, enemy.r * 2, enemy.r * 2);
    } else if (enemy.type === "tank") {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    } else if (enemy.type === "assassin") {
      ctx.rotate(time * 1.9);
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.moveTo(0, -enemy.r);
      ctx.lineTo(enemy.r * 0.72, enemy.r * 0.6);
      ctx.lineTo(-enemy.r * 0.72, enemy.r * 0.6);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (enemy.elite) {
      ctx.strokeStyle = enemy.elite.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.r + 4 + Math.sin(time * 8 + enemy.phase) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(-enemy.r, enemy.r + 6, enemy.r * 2, 4);
    ctx.fillStyle = "rgba(133, 255, 201, 0.95)";
    ctx.fillRect(-enemy.r, enemy.r + 6, enemy.r * 2 * hpRatio, 4);

    ctx.restore();
  }
}

function drawBullets(bullets) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const bullet of bullets) {
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawEnemyBullets(bullets) {
  ctx.fillStyle = "#ff93ae";
  for (const bullet of bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPickups(pickups, time) {
  for (const item of pickups) {
    const pulse = 1 + Math.sin(item.pulse + time * 6) * 0.18;
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.r * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAnomalies(anomalies, time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const anomaly of anomalies) {
    const wobble = 1 + Math.sin(time * 3 + anomaly.phase) * 0.07;
    const r = anomaly.r * wobble;

    const g = ctx.createRadialGradient(anomaly.x, anomaly.y, r * 0.12, anomaly.x, anomaly.y, r);
    g.addColorStop(0, "rgba(126, 222, 255, 0.32)");
    g.addColorStop(0.45, "rgba(255, 95, 205, 0.18)");
    g.addColorStop(1, "rgba(96, 76, 255, 0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(anomaly.x, anomaly.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawMeteors(meteors) {
  for (const meteor of meteors) {
    const t = meteor.ttl / 0.95;
    const alpha = clamp(1 - t, 0.25, 0.85);

    ctx.strokeStyle = `rgba(255, 179, 111, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 116, 80, ${alpha * 0.25})`;
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, meteor.r * 0.72, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles(particles) {
  for (const p of particles) {
    ctx.globalAlpha = clamp(p.ttl / p.maxTtl, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawWaveBanner(wave) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.textAlign = "center";
  ctx.font = "700 34px Orbitron, Noto Sans TC, sans-serif";
  ctx.fillText(`第 ${wave} 波`, WORLD_WIDTH / 2, 72);

  ctx.font = "600 15px Noto Sans TC, sans-serif";
  ctx.fillStyle = "rgba(188, 209, 255, 0.88)";
  ctx.fillText("裂隙強度上升，敵潮再臨", WORLD_WIDTH / 2, 96);
}

function drawCrosshair() {
  if (!input.mouse.inside) {
    return;
  }

  const x = input.mouse.x;
  const y = input.mouse.y;

  ctx.strokeStyle = "rgba(129, 243, 255, 0.8)";
  ctx.lineWidth = 1.4;

  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - 6, y);
  ctx.moveTo(x + 6, y);
  ctx.lineTo(x + 16, y);
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x, y - 6);
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
}

function drawEventOverlay() {
  if (!state.worldEvent) {
    return;
  }

  if (state.worldEvent.type === "gravity") {
    ctx.save();
    ctx.strokeStyle = "rgba(148, 136, 255, 0.34)";
    ctx.lineWidth = 2;
    const cx = WORLD_WIDTH * 0.5;
    const cy = WORLD_HEIGHT * 0.5;
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy, 55 + i * 34 + Math.sin(performance.now() * 0.003 + i) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function updateParticles(activeState, dt) {
  for (let i = activeState.particles.length - 1; i >= 0; i -= 1) {
    const p = activeState.particles[i];
    p.ttl -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.ttl <= 0) {
      activeState.particles.splice(i, 1);
    }
  }
}

function emitHitSpark(activeState, x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const a = activeState.rng() * Math.PI * 2;
    const speed = randRange(activeState.rng, 70, 250);
    const ttl = randRange(activeState.rng, 0.12, 0.34);

    activeState.particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      ttl,
      maxTtl: ttl,
      size: randRange(activeState.rng, 1.6, 3.5),
      color,
    });
  }
}

function emitRing(activeState, x, y, color) {
  for (let i = 0; i < 44; i += 1) {
    const a = (Math.PI * 2 * i) / 44;
    const speed = randRange(activeState.rng, 170, 440);
    const ttl = randRange(activeState.rng, 0.24, 0.55);

    activeState.particles.push({
      x,
      y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      ttl,
      maxTtl: ttl,
      size: randRange(activeState.rng, 2, 4),
      color,
    });
  }
}

function emitBolt(activeState, x1, y1, x2, y2, color) {
  const segs = 9;
  for (let i = 0; i <= segs; i += 1) {
    const t = i / segs;
    const x = x1 + (x2 - x1) * t + randRange(activeState.rng, -4, 4);
    const y = y1 + (y2 - y1) * t + randRange(activeState.rng, -4, 4);
    const ttl = randRange(activeState.rng, 0.08, 0.14);

    activeState.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      ttl,
      maxTtl: ttl,
      size: randRange(activeState.rng, 2, 3.4),
      color,
    });
  }
}

function updateToasts(activeState, dt) {
  let dirty = false;

  for (let i = activeState.toasts.length - 1; i >= 0; i -= 1) {
    const toast = activeState.toasts[i];
    toast.ttl -= dt;
    if (toast.ttl <= 0) {
      activeState.toasts.splice(i, 1);
      dirty = true;
    }
  }

  if (dirty) {
    activeState.feedDirty = true;
  }

  if (activeState.feedDirty) {
    renderFeed(activeState);
  }
}

function pushFeed(text, color = "#dbe9ff") {
  state.toasts.unshift({
    id: `${Date.now()}_${Math.random()}`,
    text,
    color,
    ttl: 4.4,
  });

  if (state.toasts.length > 6) {
    state.toasts.length = 6;
  }

  state.feedDirty = true;
}

function queueDialogue(speaker, text, duration = 4.2) {
  state.npcDialogueQueue.push({ speaker, text, duration });
}

function updateDialogue(dt) {
  if (state.dialogueTimer > 0) {
    state.dialogueTimer -= dt;
    if (state.dialogueTimer <= 0) {
      dialogueBoxEl.classList.add("hidden");
      dialogueSpeakerEl.textContent = "";
      dialogueTextEl.textContent = "";
    }
  }

  if (state.dialogueTimer <= 0 && state.npcDialogueQueue.length > 0) {
    const next = state.npcDialogueQueue.shift();
    dialogueSpeakerEl.textContent = next.speaker;
    dialogueTextEl.textContent = next.text;
    dialogueBoxEl.classList.remove("hidden");
    state.dialogueTimer = next.duration;
  }
}

function renderFeed(activeState) {
  feedEl.innerHTML = "";

  for (const toast of activeState.toasts) {
    const div = document.createElement("div");
    div.className = "feed-item";
    div.textContent = toast.text;
    div.style.color = toast.color;
    feedEl.appendChild(div);
  }

  activeState.feedDirty = false;
}

function syncHud() {
  const p = state.player;

  scoreEl.textContent = String(Math.floor(state.score));
  highScoreEl.textContent = String(Math.floor(state.highScore));
  waveEl.textContent = String(state.wave);

  const comboMult = 1 + Math.min(state.combo * 0.07, 6);
  comboEl.textContent = comboMult.toFixed(1);
  comboRankEl.textContent = comboRank(comboMult);

  levelEl.textContent = String(p.level);
  xpTextEl.textContent = `${Math.floor(p.xp)} / ${p.xpToNext}`;
  xpBarEl.style.width = `${(p.xp / p.xpToNext) * 100}%`;

  hpTextEl.textContent = `${Math.ceil(p.hp)} / ${p.maxHp}`;
  hpBarEl.style.width = `${(p.hp / p.maxHp) * 100}%`;

  shieldTextEl.textContent = `${Math.ceil(p.shield)} / ${p.maxShield}`;
  shieldBarEl.style.width = `${(p.shield / p.maxShield) * 100}%`;

  energyTextEl.textContent = `${Math.ceil(p.energy)} / ${p.maxEnergy}`;
  energyBarEl.style.width = `${(p.energy / p.maxEnergy) * 100}%`;

  pilotClassEl.textContent = state.classId ? CLASS_DEFS[state.classId].name : "未選擇";
  weaponEl.textContent = WEAPONS[p.weapon].label;
  bombsEl.textContent = String(p.bombs);
  revivesEl.textContent = String(p.revives);
  dashCdEl.textContent = `${p.dashCd.toFixed(1)}s`;

  ultTextEl.textContent = `${Math.floor(p.ultCharge)}%`;
  ultBarEl.style.width = `${p.ultCharge}%`;

  coresEl.textContent = String(state.totalCores);
  runCoresEl.textContent = String(state.runCores);
  chapterNameEl.textContent = state.chapter?.name || "未部署章節";
  chapterSectorEl.textContent = state.chapter?.code || "S-00";
  threatTextEl.textContent = `${state.directorThreat.toFixed(2)}x`;
  allyTextEl.textContent = state.supportCd > 0
    ? `${state.supportCharges}（CD ${state.supportCd.toFixed(1)}s）`
    : `${state.supportCharges}（就緒）`;
  achievementTextEl.textContent = `${state.achievementSet.size}/${ACHIEVEMENT_DEFS.length}`;

  if (state.phase === "start") {
    statusEl.textContent = "待命";
  } else if (state.phase === "paused") {
    statusEl.textContent = "暫停中";
  } else if (state.phase === "choice") {
    statusEl.textContent = "升級選擇";
  } else if (state.phase === "gameover") {
    statusEl.textContent = "訊號中斷";
  } else if (p.igniteTimer > 0) {
    statusEl.textContent = "焚界模式";
  } else if (state.timeScale < 1) {
    statusEl.textContent = "子彈時間";
  } else {
    statusEl.textContent = "戰鬥中";
  }

  if (state.mission) {
    missionTitleEl.textContent = `任務：${state.mission.title}`;
    missionProgressEl.textContent = `進度：${Math.floor(state.mission.progress)} / ${state.mission.target}`;
    missionRewardEl.textContent = `獎勵：${state.mission.rewardText}`;
  } else {
    missionTitleEl.textContent = "任務：待派發";
    missionProgressEl.textContent = "進度：-";
    missionRewardEl.textContent = "獎勵：-";
  }

  if (state.worldEvent) {
    eventTextEl.textContent = `世界事件：${state.worldEvent.label}（${state.worldEvent.remaining.toFixed(1)}s）`;
  } else {
    eventTextEl.textContent = "世界事件：無";
  }

  pauseBtn.textContent = state.phase === "paused" ? "繼續" : "暫停";
}

function comboRank(mult) {
  if (mult < 1.5) return "E";
  if (mult < 2.2) return "D";
  if (mult < 3) return "C";
  if (mult < 4.1) return "B";
  if (mult < 5.3) return "A";
  if (mult < 6.2) return "S";
  return "SS";
}

function bindEvents() {
  document.addEventListener("keydown", (event) => {
    const key = normalizeKey(event.key);
    input.keys.add(key);

    if (!event.repeat) {
      input.justPressed.add(key);
    }

    if (
      key === "arrowup" ||
      key === "arrowdown" ||
      key === "arrowleft" ||
      key === "arrowright" ||
      key === " " ||
      key === "space"
    ) {
      event.preventDefault();
    }

    if (!event.repeat && key === "p") {
      togglePause();
    }

    if (!event.repeat && key === "r") {
      restartGame();
    }

    if (!event.repeat && key === "o") {
      openStrategicOverlay(showArmoryOverlay);
    }

    if (!event.repeat && key === "c") {
      openStrategicOverlay(showCodexOverlay);
    }

    if (!event.repeat && key === "m") {
      openStrategicOverlay(showChapterMapOverlay);
    }

    if (!event.repeat && key === "t") {
      openStrategicOverlay(showTechTreeOverlay);
    }

    if (!event.repeat && key === "n") {
      openStrategicOverlay(showFactionCommOverlay);
    }
  });

  document.addEventListener("keyup", (event) => {
    input.keys.delete(normalizeKey(event.key));
  });

  const updateCanvasPointer = (event) => {
    const point = toWorldPoint(event.clientX, event.clientY);
    input.mouse.x = point.x;
    input.mouse.y = point.y;
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    updateCanvasPointer(event);
    input.mouse.inside = true;
    if (event.pointerType === "mouse") {
      input.mouse.down = true;
    } else {
      input.touch.fire = true;
      input.touchAimPointerId = event.pointerId;
    }
    canvas.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse" || input.touchAimPointerId === event.pointerId) {
      updateCanvasPointer(event);
      input.mouse.inside = true;
    }
  });

  const releaseCanvasPointer = (event) => {
    if (event.pointerType === "mouse") {
      input.mouse.down = false;
      if (event.type === "pointerleave") {
        input.mouse.inside = false;
      }
      return;
    }
    if (input.touchAimPointerId === event.pointerId) {
      input.touch.fire = false;
      input.touchAimPointerId = null;
      input.mouse.inside = false;
      canvas.releasePointerCapture?.(event.pointerId);
    }
  };

  canvas.addEventListener("pointerup", releaseCanvasPointer);
  canvas.addEventListener("pointercancel", releaseCanvasPointer);
  canvas.addEventListener("pointerleave", releaseCanvasPointer);
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  pauseBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", restartGame);
  fullBtn?.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreenButtonLabel);
  syncFullscreenButtonLabel();

  touchButtons.forEach((button) => {
    const key = button.dataset.touch;
    if (!key) {
      return;
    }

    const onDown = (event) => {
      event.preventDefault();
      if (key === "dash") {
        input.queuedDash = true;
      } else if (key === "bomb") {
        input.queuedBomb = true;
      } else if (key === "ult") {
        input.queuedUlt = true;
      } else if (key === "support") {
        input.justPressed.add("g");
      } else {
        input.touch[key] = true;
      }
    };

    const onUp = (event) => {
      event.preventDefault();
      if (key !== "dash" && key !== "bomb" && key !== "ult" && key !== "support") {
        input.touch[key] = false;
      }
    };

    button.addEventListener("pointerdown", onDown);
    button.addEventListener("pointerup", onUp);
    button.addEventListener("pointercancel", onUp);
    button.addEventListener("pointerleave", onUp);
  });

  window.addEventListener("blur", clearRuntimeInputState);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearRuntimeInputState();
    }
  });
}

function syncFullscreenButtonLabel() {
  if (!fullBtn) {
    return;
  }
  fullBtn.textContent = document.fullscreenElement ? "離開全螢幕" : "全螢幕";
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    const request = document.documentElement.requestFullscreen;
    if (typeof request === "function") {
      Promise.resolve(request.call(document.documentElement)).catch(() => {});
    }
    return;
  }
  const exit = document.exitFullscreen;
  if (typeof exit === "function") {
    Promise.resolve(exit.call(document)).catch(() => {});
  }
}

function showOverlay(title, text, actions) {
  overlayTitleEl.textContent = title;
  overlayTextEl.textContent = text;
  overlayActionsEl.innerHTML = "";

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    if (action.className) {
      button.className = action.className;
    }
    button.addEventListener("click", action.onClick);
    overlayActionsEl.appendChild(button);
  });

  overlayEl.classList.remove("hidden");
  document.body.classList.add("overlay-open");
}

function hideOverlay() {
  overlayEl.classList.add("hidden");
  document.body.classList.remove("overlay-open");
}

function findNearestEnemy(activeState, x, y) {
  let nearest = null;
  let nearestDist = Infinity;

  for (const enemy of activeState.enemies) {
    const dist = (enemy.x - x) ** 2 + (enemy.y - y) ** 2;
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemy;
    }
  }

  return nearest;
}

function kickCamera(activeState, intensity) {
  activeState.cameraShake = Math.max(activeState.cameraShake, intensity);
}

function pickRandomUpgrades(pool, count, rng) {
  const copy = [...pool];
  shuffle(copy, rng);
  return copy.slice(0, Math.min(count, copy.length));
}

function pickRandom(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function cycleOwnedWeapon(slots, current, delta) {
  if (!slots || slots.length === 0) {
    return "pulse";
  }
  const idx = slots.indexOf(current);
  const start = idx >= 0 ? idx : 0;
  const next = (start + delta + slots.length) % slots.length;
  return slots[next];
}

function toWorldPoint(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * WORLD_WIDTH,
    y: ((clientY - rect.top) / rect.height) * WORLD_HEIGHT,
  };
}

function isKeyHeld(key) {
  return input.keys.has(key);
}

function consumePress(key) {
  if (!input.justPressed.has(key)) {
    return false;
  }
  input.justPressed.delete(key);
  return true;
}

function normalizeKey(key) {
  if (key === "Spacebar") return "space";
  return key.length === 1 ? key.toLowerCase() : key.toLowerCase();
}

function defaultProfile(legacyCores) {
  return {
    cores: legacyCores,
    unlockedWeapons: [...DEFAULT_UNLOCKED_WEAPONS],
    favoriteWeapon: "pulse",
    storyCursor: 0,
    loreCursor: 0,
    selectedChapter: CHAPTER_MAP[0].id,
    chapterProgress: {
      [CHAPTER_MAP[0].id]: 1,
    },
    techNodes: [],
    achievements: [],
    factionRep: {
      曙光議會: 0,
      深空行會: 0,
      灰燼機巧: 0,
    },
    metaUpgrades: {
      meta_hp: 0,
      meta_shield: 0,
      meta_damage: 0,
      meta_energy: 0,
      meta_core: 0,
    },
  };
}

function loadProfile() {
  const legacyCores = loadNumber(STORAGE_KEYS.cores, 0);
  const fallback = defaultProfile(legacyCores);

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    const merged = {
      ...fallback,
      ...parsed,
      factionRep: {
        ...fallback.factionRep,
        ...(parsed.factionRep || {}),
      },
      metaUpgrades: {
        ...fallback.metaUpgrades,
        ...(parsed.metaUpgrades || {}),
      },
    };
    merged.unlockedWeapons = [...new Set([...(merged.unlockedWeapons || []), ...DEFAULT_UNLOCKED_WEAPONS])]
      .filter((id) => WEAPONS[id]);
    merged.storyCursor = Number.isFinite(merged.storyCursor) ? Math.max(0, Math.floor(merged.storyCursor)) : 0;
    merged.loreCursor = Number.isFinite(merged.loreCursor) ? Math.max(0, Math.floor(merged.loreCursor)) : 0;
    merged.factionRep = {
      曙光議會: Number.isFinite(merged.factionRep.曙光議會) ? Math.floor(merged.factionRep.曙光議會) : 0,
      深空行會: Number.isFinite(merged.factionRep.深空行會) ? Math.floor(merged.factionRep.深空行會) : 0,
      灰燼機巧: Number.isFinite(merged.factionRep.灰燼機巧) ? Math.floor(merged.factionRep.灰燼機巧) : 0,
    };
    const chapterIds = CHAPTER_MAP.map((chapter) => chapter.id);
    const chapterSet = new Set(chapterIds);
    merged.selectedChapter = chapterSet.has(merged.selectedChapter) ? merged.selectedChapter : CHAPTER_MAP[0].id;
    const chapterProgress = {};
    for (const chapterId of chapterIds) {
      const value = Number(merged.chapterProgress?.[chapterId]);
      chapterProgress[chapterId] = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    }
    chapterProgress[CHAPTER_MAP[0].id] = Math.max(1, chapterProgress[CHAPTER_MAP[0].id]);
    merged.chapterProgress = chapterProgress;
    const techNodeSet = new Set(TECH_TREE_NODES.map((node) => node.id));
    merged.techNodes = [...new Set(Array.isArray(merged.techNodes) ? merged.techNodes : [])]
      .filter((id) => techNodeSet.has(id));
    const achievementSet = new Set(ACHIEVEMENT_DEFS.map((achievement) => achievement.id));
    merged.achievements = [...new Set(Array.isArray(merged.achievements) ? merged.achievements : [])]
      .filter((id) => achievementSet.has(id));
    if (!merged.favoriteWeapon || !merged.unlockedWeapons.includes(merged.favoriteWeapon)) {
      merged.favoriteWeapon = merged.unlockedWeapons[0];
    }
    merged.cores = Number.isFinite(merged.cores) ? Math.max(0, Math.floor(merged.cores)) : fallback.cores;
    for (const upgrade of SHOP_META_UPGRADES) {
      const current = Number(merged.metaUpgrades[upgrade.id]);
      merged.metaUpgrades[upgrade.id] = Number.isFinite(current)
        ? clamp(Math.floor(current), 0, upgrade.maxLevel)
        : 0;
    }
    return merged;
  } catch {
    return fallback;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  } catch {
    // Ignore storage errors.
  }
}

function loadNumber(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function saveNumber(key, value) {
  try {
    localStorage.setItem(key, String(Math.floor(value)));
  } catch {
    // Ignore storage errors.
  }
}

function circleHit(ax, ay, ar, bx, by, br) {
  const dx = ax - bx;
  const dy = ay - by;
  const rr = ar + br;
  return dx * dx + dy * dy <= rr * rr;
}

function angleBetween(ax, ay, bx, by) {
  return Math.atan2(by - ay, bx - ax);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function randRange(rng, min, max) {
  return min + (max - min) * rng();
}

function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

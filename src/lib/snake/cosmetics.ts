export interface TrailDef { id: string; name: string; price: number; color: string; secondary: string }
export interface HeadDef { id: string; name: string; price: number; color: string; kind: "none" | "crown" | "halo" | "core" }
export interface ThemeDef { id: string; name: string; price: number; hueA: number; hueB: number; hueC: number; accent: string }

export const TRAILS: TrailDef[] = [
  { id: "none",       name: "None",            price: 0,    color: "#000",     secondary: "#000" },
  { id: "lightning",  name: "Lightning Trail", price: 400,  color: "#fde047",  secondary: "#7df9ff" },
  { id: "fire",       name: "Fire Trail",      price: 600,  color: "#ff7849",  secondary: "#ffd166" },
  { id: "galaxy",     name: "Galaxy Trail",    price: 900,  color: "#a78bfa",  secondary: "#ff5ec4" },
  { id: "rainbow",    name: "Rainbow Trail",   price: 1500, color: "#ff5ec4",  secondary: "#7df9ff" },
  { id: "digital",    name: "Digital Trail",   price: 800,  color: "#39ff88",  secondary: "#22d3ee" },
];

export const HEADS: HeadDef[] = [
  { id: "none",  name: "None",         price: 0,    color: "#fff",    kind: "none" },
  { id: "crown", name: "Crown",        price: 1200, color: "#fde047", kind: "crown" },
  { id: "halo",  name: "Neon Halo",    price: 900,  color: "#7df9ff", kind: "halo" },
  { id: "core",  name: "Energy Core",  price: 1500, color: "#ff5ec4", kind: "core" },
];

export const THEMES: ThemeDef[] = [
  { id: "cyber-grid",      name: "Cyber Grid",      price: 0,    hueA: 195, hueB: 285, hueC: 320, accent: "#7df9ff" },
  { id: "midnight-void",   name: "Midnight Void",   price: 500,  hueA: 240, hueB: 270, hueC: 300, accent: "#818cf8" },
  { id: "sunset-blaze",    name: "Sunset Blaze",    price: 600,  hueA: 10,  hueB: 30,  hueC: 50,  accent: "#fb923c" },
  { id: "ocean-depths",    name: "Ocean Depths",    price: 550,  hueA: 190, hueB: 210, hueC: 230, accent: "#38bdf8" },
  { id: "forest-glow",     name: "Forest Glow",     price: 650,  hueA: 120, hueB: 140, hueC: 100, accent: "#4ade80" },
  { id: "plasma-pulse",    name: "Plasma Pulse",    price: 700,  hueA: 280, hueB: 300, hueC: 260, accent: "#c084fc" },
  { id: "arctic-frost",    name: "Arctic Frost",    price: 580,  hueA: 180, hueB: 200, hueC: 220, accent: "#67e8f9" },
  { id: "crimson-dream",   name: "Crimson Dream",   price: 620,  hueA: 340, hueB: 360, hueC: 320, accent: "#f472b6" },
];

export function getTrail(id: string): TrailDef { return TRAILS.find(t => t.id === id) ?? TRAILS[0]; }
export function getHead(id: string): HeadDef { return HEADS.find(t => t.id === id) ?? HEADS[0]; }
export function getTheme(id: string): ThemeDef { return THEMES.find(t => t.id === id) ?? THEMES[0]; }
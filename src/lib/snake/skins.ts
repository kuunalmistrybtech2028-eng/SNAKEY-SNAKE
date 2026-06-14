export interface SkinDef {
  id: string;
  name: string;
  price: number;
  head: string;     // color
  body: string;
  glow: string;
  trail: string;
}

export const SKINS: SkinDef[] = [
  { id: "cyber",   name: "Cyber",        price: 0,   head: "#7df9ff", body: "#22d3ee", glow: "#22d3ee", trail: "#a78bfa" },
  { id: "plasma",  name: "Plasma",       price: 250, head: "#ff77e9", body: "#e94aff", glow: "#e94aff", trail: "#7df9ff" },
  { id: "solar",   name: "Solar Flare",  price: 500, head: "#ffd166", body: "#ff7849", glow: "#ff9551", trail: "#ff4d6d" },
  { id: "matrix",  name: "Matrix",       price: 750, head: "#aaffc3", body: "#39ff88", glow: "#39ff88", trail: "#00ffd1" },
  { id: "void",    name: "Void Walker",  price: 1000,head: "#c4b5fd", body: "#7c3aed", glow: "#a78bfa", trail: "#ff5ec4" },
  { id: "ember",   name: "Fire",         price: 1500,head: "#ff9a8b", body: "#ef4444", glow: "#ff6363", trail: "#ffd166" },
  { id: "ice",     name: "Ice",          price: 800, head: "#dbeafe", body: "#60a5fa", glow: "#93c5fd", trail: "#7df9ff" },
  { id: "galaxy",  name: "Galaxy",       price: 1800,head: "#fde68a", body: "#7c3aed", glow: "#a78bfa", trail: "#ec4899" },
  { id: "dragon",  name: "Cyber Dragon", price: 2500,head: "#fef3c7", body: "#16a34a", glow: "#84cc16", trail: "#facc15" },
  { id: "rainbow", name: "Rainbow",      price: 3000,head: "#ffffff", body: "#ff5ec4", glow: "#7df9ff", trail: "#fde68a" },
  { id: "shadow",  name: "Shadow",       price: 1200,head: "#9ca3af", body: "#1f2937", glow: "#4b5563", trail: "#7df9ff" },
  { id: "electric",name: "Electric",     price: 1400,head: "#fef08a", body: "#facc15", glow: "#fde047", trail: "#7df9ff" },
];

export function getSkin(id: string): SkinDef {
  return SKINS.find((s) => s.id === id) ?? SKINS[0];
}
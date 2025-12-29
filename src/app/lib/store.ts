import { Script } from "./types";

const scripts: Script[] = [
  {
    id: "1",
    title: "Universal Autofarm",
    game: "Blox Fruits",
    functionality: ["autofarm", "combat"],
    mobileFriendly: true,
    keysystem: "linkvertise",
    description: "Fast leveling with safe routes and boss cycles.",
    code: "-- Lua autofarm example\nprint(\"Autofarm running\")",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "ESP and Teleport",
    game: "Arsenal",
    functionality: ["esp", "teleport"],
    mobileFriendly: false,
    keysystem: "none",
    description: "Visual overlays and quick teleports to objectives.",
    code: "-- Lua ESP example\nprint(\"ESP active\")",
    createdAt: new Date().toISOString(),
  },
];

export function listScripts(): Script[] {
  return scripts.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getScript(id: string): Script | undefined {
  return scripts.find((s) => s.id === id);
}

export function addScript(payload: Omit<Script, "id" | "createdAt">): Script {
  const id = String(Math.max(0, ...scripts.map((s) => Number(s.id))) + 1);
  const next: Script = { ...payload, id, createdAt: new Date().toISOString() };
  scripts.push(next);
  return next;
}

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { GameCanvas } from "@/components/snake/GameCanvas";
import { NeonBackground } from "@/components/snake/NeonBackground";
import type { GameMode } from "@/lib/snake/settings";

const search = z.object({
  mode: z.enum(["classic", "neon-rush", "reverse"]).default("classic"),
});

export const Route = createFileRoute("/play")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Play — Snakey Snake" },
      { name: "description", content: "Play Snakey Snake in Classic, Neon Rush or Reverse mode." },
    ],
  }),
  component: Play,
});

function Play() {
  const { mode } = Route.useSearch();
  return (
    <main className="fixed inset-0 overflow-hidden overscroll-none touch-none flex items-center justify-center">
      <NeonBackground intensity={0.6} />
      <GameCanvas mode={mode as GameMode} />
    </main>
  );
}
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/play.tsx
var $$splitComponentImporter = () => import("./play-Dk6vy28A.js");
var search = z.object({ mode: z.enum([
	"classic",
	"neon-rush",
	"reverse"
]).default("classic") });
var Route = createFileRoute("/play")({
	validateSearch: search,
	head: () => ({ meta: [{ title: "Play — Snakey Snake" }, {
		name: "description",
		content: "Play Snakey Snake in Classic, Neon Rush or Reverse mode."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cardwright")({
  server: {
    handlers: {
      GET: () => Response.json({ desktop: false }),
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { pngFromZip } from "@/lib/novelai";

const ENDPOINT = "https://image.novelai.net/ai/generate-image";

export const Route = createFileRoute("/api/novelai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.replace(/^Bearer\s+/i, "").trim();
        if (token.length < 8) {
          return Response.json({ message: "Add your NovelAI persistent token." }, { status: 401 });
        }
        const body = await request.text();
        if (body.length > 8_000_000) {
          return Response.json({ message: "That draw, including the style plate, is too large." }, { status: 413 });
        }
        try {
          const upstream = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body,
            signal: AbortSignal.timeout(180_000),
          });
          const bytes = new Uint8Array(await upstream.arrayBuffer());
          if (!upstream.ok) {
            const copy = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
            return new Response(copy, {
              status: upstream.status,
              headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
            });
          }
          const png = await pngFromZip(bytes);
          const picture = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;
          return new Response(picture, { headers: { "Content-Type": "image/png" } });
        } catch (error) {
          const message = error instanceof Error && error.message ? error.message : "Could not reach NovelAI.";
          return Response.json({ message }, { status: 502 });
        }
      },
    },
  },
});
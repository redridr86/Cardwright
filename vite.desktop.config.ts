import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: here("./desktop"),
  publicDir: false,
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: { "@": here("./src") },
  },
  base: "./",
  build: {
    outDir: here("./dist-desktop"),
    emptyOutDir: true,
  },
});

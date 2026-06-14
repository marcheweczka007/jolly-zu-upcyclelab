import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { blogWatchPlugin } from "./scripts/vite-plugin-blog-watch.mjs";

export default defineConfig({
  envPrefix: ["VITE_", "SHOW_"],
  plugins: [TanStackRouterVite(), react(), tailwindcss(), tsconfigPaths(), blogWatchPlugin()],
  server: {
    port: 5173,
    // Let netlify dev pick another port if 5173 is already in use.
    strictPort: false,
    proxy: {
      "/.netlify/functions": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true,
      },
    },
  },
});

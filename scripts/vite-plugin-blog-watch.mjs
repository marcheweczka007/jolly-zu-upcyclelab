import { spawnSync } from "node:child_process";
import { watch } from "node:fs";
import { join } from "node:path";

/** Rebuild blog-manifest.json when content/blog/*.md changes during dev. */
export function blogWatchPlugin() {
  return {
    name: "blog-watch",
    configureServer(server) {
      const contentDir = join(process.cwd(), "content/blog");
      let debounce;

      const regenerate = () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          const result = spawnSync("node", ["scripts/generate-blog.mjs"], {
            cwd: process.cwd(),
            stdio: "inherit",
          });
          if (result.status === 0) {
            server.ws.send({ type: "full-reload", path: "*" });
          }
        }, 300);
      };

      watch(contentDir, (_event, filename) => {
        if (filename?.endsWith(".md") && filename.toLowerCase() !== "readme.md") {
          regenerate();
        }
      });
    },
  };
}

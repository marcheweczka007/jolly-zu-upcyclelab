import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Load .env from project root into process.env (does not override existing). */
export function loadEnv(cwd = process.cwd()) {
  try {
    const path = resolve(cwd, ".env");
    const content = readFileSync(path, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // no .env
  }
}

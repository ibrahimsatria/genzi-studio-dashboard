#!/usr/bin/env node
/**
 * serve.mjs — convenience wrapper that runs `next dev` (Turbopack).
 *
 * Usage:
 *   node serve.mjs            → starts on http://localhost:3000
 *   node serve.mjs --port 4000 → starts on the given port
 *
 * Note: the project already exposes `npm run dev` which does the same thing.
 * This wrapper exists because Frontend Website Rules (CLAUDE.md §10) reference
 * `node serve.mjs` as the canonical local-dev entrypoint.
 */
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const portIdx = args.findIndex((a) => a === "--port" || a === "-p");
const port =
  portIdx >= 0 && args[portIdx + 1] ? args[portIdx + 1] : process.env.PORT || "3000";

const child = spawn("npx", ["next", "dev", "--turbo", "--port", port], {
  stdio: "inherit",
  env: { ...process.env, PORT: port },
});

child.on("exit", (code) => process.exit(code ?? 0));

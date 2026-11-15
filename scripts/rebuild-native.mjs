/**
 * Rebuilds native addons (better-sqlite3) for the Node runtime that will
 * actually load them.
 *
 * Why: Netlify's function bundle can carry a better-sqlite3 binary built for a
 * different Node ABI, which fails at runtime with
 * "Module did not self-register". Rebuilding during the build guarantees the
 * addon matches the runtime.
 *
 * Only runs when REBUILD_NATIVE_DEPS=true is set (Netlify build environment),
 * so local builds are untouched.
 */
import { execSync } from "node:child_process";

if (process.env.REBUILD_NATIVE_DEPS !== "true") {
  console.log("[native] skipping rebuild (REBUILD_NATIVE_DEPS not set)");
  process.exit(0);
}

try {
  console.log("[native] rebuilding better-sqlite3 for this runtime…");
  execSync("npm rebuild better-sqlite3 --depth=10", { stdio: "inherit" });
  console.log("[native] rebuild complete");
} catch (error) {
  console.warn("[native] rebuild failed (continuing):", error instanceof Error ? error.message : error);
}

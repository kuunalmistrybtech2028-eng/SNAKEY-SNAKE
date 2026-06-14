import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// Read process.env inside functions/handlers so values resolve at request time
// in serverless environments (e.g. Vercel Functions).
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
  };
}

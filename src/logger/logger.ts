import type { Logger } from "./types.ts";

export const createConsoleLogger = (): Logger => ({
  log: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
});

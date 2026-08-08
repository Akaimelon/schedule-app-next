type LogLevel = "info" | "warn" | "error";

export function log(
  level: LogLevel,
  message: string,
  context: Record<string, unknown> = {},
) {
  console.log(JSON.stringify({ time: new Date().toISOString(), level, message, ...context }));
}

export function createLogger(base: Record<string, unknown>) {
  return (level: LogLevel, message: string, context: Record<string, unknown> = {}) =>
    log(level, message, { ...base, ...context });
}
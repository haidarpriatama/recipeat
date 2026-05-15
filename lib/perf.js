export async function measureServerTiming(label, fn) {
  const shouldLog = process.env.NODE_ENV === "production";

  if (!shouldLog) {
    return fn();
  }

  const start = Date.now();

  try {
    return await fn();
  } finally {
    console.log(`[perf] ${label} ${Date.now() - start}ms`);
  }
}

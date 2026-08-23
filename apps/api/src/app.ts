import { env } from "./env.js";
import { buildServer } from "./server.js";
import { sdk } from "./telemetry/sdk.js";

const server = buildServer();

const shutdown = async (signal: NodeJS.Signals) => {
  server.log.info({ signal, timeoutMs: env.SHUTDOWN_TIMEOUT_MS }, "shutdown started");

  const forceExit = setTimeout(() => {
    server.log.error({ timeoutMs: env.SHUTDOWN_TIMEOUT_MS }, "shutdown timed out, forcing exit");
    process.exit(1);
  }, env.SHUTDOWN_TIMEOUT_MS);

  forceExit.unref();

  try {
    await server.close();
    await sdk.shutdown();

    server.log.info("shutdown complete");
    process.exitCode = 0;
  } catch (err) {
    server.log.error({ err }, "error during shutdown");
    process.exitCode = 1;
  } finally {
    clearTimeout(forceExit);
  }
};

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => void shutdown(signal));
}

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();

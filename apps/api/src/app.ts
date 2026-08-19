import "dotenv/config";
import { buildServer } from "./server.js";

const server = buildServer();

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const SHUTDOWN_TIMEOUT_MS = Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10_000;

const shutdown = async (signal: NodeJS.Signals) => {
  server.log.info({ signal, timeoutMs: SHUTDOWN_TIMEOUT_MS }, "shutdown started");

  const forceExit = setTimeout(() => {
    server.log.error({ timeoutMs: SHUTDOWN_TIMEOUT_MS }, "shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExit.unref();

  try {
    await server.close();

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
    await server.listen({ port: PORT, host: HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

void start();

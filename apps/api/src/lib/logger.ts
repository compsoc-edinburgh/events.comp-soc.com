import { PinoLoggerOptions } from "fastify/types/logger.js";

export const loggerConfig: PinoLoggerOptions = {
  level: process.env.NODE_ENV === "test" ? "warn" : "info",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname,reqId",
            colorize: true,
          },
        }
      : undefined,
};

import { PinoLoggerOptions } from "fastify/types/logger.js";
import { env } from "../env.js";

export const loggerConfig: PinoLoggerOptions = {
  level: env.NODE_ENV === "test" ? "warn" : "info",
  transport:
    env.NODE_ENV !== "production"
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

import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(8080),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),

  DATABASE_URL: z.string().min(1),

  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),

  OTEL_SERVICE_NAME: z.string().default("events.compsoc.api"),
  OTEL_SERVICE_VERSION: z.string().default("development"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().default("http://127.0.0.1:4318"),
  OTEL_EXPORTER_OTLP_HEADERS: z.string().min(1).optional(),
});

export const env = EnvSchema.parse(process.env);

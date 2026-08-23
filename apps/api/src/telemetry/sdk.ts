import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { FastifyOtelInstrumentation } from "@fastify/otel";
import { env } from "../env.js";

export const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": env.OTEL_SERVICE_NAME,
    "service.version": env.OTEL_SERVICE_VERSION,
    "deployment.environment.name": env.NODE_ENV,
  }),

  traceExporter: new OTLPTraceExporter({
    url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
  }),

  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },
      "@opentelemetry/instrumentation-dns": { enabled: false },
      "@opentelemetry/instrumentation-net": { enabled: false },
      "@opentelemetry/instrumentation-http": {
        ignoreIncomingRequestHook: (request) => request.url === "/health",
      },
    }),

    new FastifyOtelInstrumentation({
      registerOnInitialization: true,
      instrumentHooks: false,
      ignorePaths: "/health",
    }),
  ],
});

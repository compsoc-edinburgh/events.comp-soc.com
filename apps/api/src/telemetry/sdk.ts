import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { FastifyOtelInstrumentation } from "@fastify/otel";
import { OTEL_SERVICE_NAME, OTEL_SERVICE_VERSION, OTEL_BASE_URL } from "./config.js";

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    "service.name": OTEL_SERVICE_NAME,
    "service.version": OTEL_SERVICE_VERSION,
    "deployment.environment.name": "development",
  }),

  traceExporter: new OTLPTraceExporter({
    url: `${OTEL_BASE_URL}/v1/traces`,
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

sdk.start();

// To have an ability to parse env for the otel
import "dotenv/config";

const { sdk } = await import("./telemetry/sdk.js");
sdk.start();

await import("./app.js");

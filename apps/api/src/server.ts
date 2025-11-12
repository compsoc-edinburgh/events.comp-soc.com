import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });

await app.register(cors, { origin: "*" });

app.get("/", async () => ({ message: "API is running 🚀" }));

app.get("/events", async () => [
  { id: 1, name: "HackTheBurgh" },
  { id: 2, name: "Art Meets Code" },
]);

try {
  await app.listen({ port: 8080, host: "0.0.0.0" });
  console.log("🚀 Server running at http://localhost:8080");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

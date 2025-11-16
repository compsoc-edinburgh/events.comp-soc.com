import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { setupPrisma } from "./plugins/setupPrisma";
import userRoutes from "./routes/user";

const app = Fastify({ logger: true });

await app.register(clerkPlugin);
await setupPrisma(app);

app.register(userRoutes, { prefix: "/v1/users" });

try {
  await app.listen({ port: 8080, host: "0.0.0.0" });
  console.log("🚀 Server running at http://localhost:8080");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

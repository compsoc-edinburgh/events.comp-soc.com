import "dotenv/config";
import Fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { setupPrisma } from "./plugins/setup-prisma";
import usersRoutes from "./routes/users";
import eventsRoutes from "./routes/events";

const app = Fastify({ logger: true });

// Auth
await app.register(clerkPlugin);

// Database
await setupPrisma(app);

// Routes
app.register(usersRoutes, { prefix: "/v1/users" });
app.register(eventsRoutes, { prefix: "/v1/events" });

// Health check
app.get("/health", async () => ({ status: "ok" }));

async function start() {
  try {
    await app.listen({
      port: Number(process.env.PORT),
      host: process.env.HOST
    });

    app.log.info(`Server running on port ${process.env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  const shutdown = async () => {
    app.log.info("Shutting down");
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  app.log.error(err);
  process.exit(1);
});

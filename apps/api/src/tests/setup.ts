import Fastify, { type FastifyInstance } from "fastify";
import { setupPrisma } from "../plugins/setupPrisma";
import eventsRoutes from "../routes/events";
import usersRoutes from "../routes/users";
import { clerkPlugin } from "@clerk/fastify";
import { vi } from "vitest";

vi.mock("@clerk/fastify", () => ({
  clerkPlugin: vi.fn((instance: any, _opts: any, done: any) => {
    instance.decorate("auth", {
      userId: "test-user",
      isAuthenticated: true
    });
    done();
  }),
  getAuth: vi.fn(() => ({
    userId: "test-user",
    isAuthenticated: true
  }))
}));

export async function App(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  app.register(clerkPlugin);

  await setupPrisma(app);

  app.register(usersRoutes, { prefix: "/v1/users" });
  app.register(eventsRoutes, { prefix: "/v1/events" });

  app.get("/health", async () => ({ status: "ok" }));

  await app.ready();
  return app;
}

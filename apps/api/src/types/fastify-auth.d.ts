import type { Nullable } from "@monorepo/types";

declare module "fastify" {
  interface FastifyRequest {
    auth: {
      userId: Nullable<string>;
    };
  }
}

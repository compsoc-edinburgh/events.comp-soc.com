import { UserRole } from "@events.comp-soc.com/shared";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      role: UserRole;
    };
    rawBody?: string;
  }
}

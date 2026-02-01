import { UserRole, Sigs } from "@events.comp-soc.com/shared";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
      sigs?: Sigs[];
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: {
      userId: string;
      role: UserRole;
      sigs?: Sigs[];
    };
    rawBody?: string;
  }
}

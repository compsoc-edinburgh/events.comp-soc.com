export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "user" | "committee";
    };
  }
}

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "member" | "committee";
    };
  }
}

import { Nullable } from "@events.comp-soc.com/shared";

export type MockAuthState = {
  userId: Nullable<string>;
  sessionClaims: unknown;
};

export let activeMockAuthState: MockAuthState = {
  userId: null,
  sessionClaims: null,
};

export const setMockAuth = (payload: Partial<MockAuthState>) => {
  activeMockAuthState = { ...activeMockAuthState, ...payload };
};

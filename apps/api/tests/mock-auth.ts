import { Nullable, UserRole, Sigs } from "@events.comp-soc.com/shared";

export type MockSessionClaims = {
  metadata: {
    role: UserRole;
    sigs?: Sigs[];
  };
} | null;

export type MockAuthState = {
  userId: Nullable<string>;
  sessionClaims: MockSessionClaims;
};

export let activeMockAuthState: MockAuthState = {
  userId: null,
  sessionClaims: null,
};

export const setMockAuth = (payload: Partial<MockAuthState>) => {
  activeMockAuthState = { ...activeMockAuthState, ...payload };
};

export const setSigExecutiveAuth = (userId: string, sigs: Sigs[]) => {
  setMockAuth({
    userId,
    sessionClaims: {
      metadata: {
        role: UserRole.SigExecutive,
        sigs,
      },
    },
  });
};

export const setMemberAuth = (userId: string) => {
  setMockAuth({
    userId,
    sessionClaims: {
      metadata: {
        role: UserRole.Member,
      },
    },
  });
};

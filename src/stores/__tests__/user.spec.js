/* eslint-disable prettier/prettier */
import { createPinia, setActivePinia } from "pinia";
import useUserStore from "@/stores/user";
import { describe, beforeEach, test, expect, vi } from "vitest";

vi.mock("@/includes/firebase", () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve({
      user: {
        uid: "12345",
        displayName: "John",
        isAdmin: "true"
      }
    })
  },
  usersCollection: {
    doc: () => ({
      get: () => Promise.resolve({
        data: () => ({
          isAdmin: true
        })
      })
    })
  }
}));
describe("User Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test("authenticate user", async () => {
    const store = useUserStore();

    expect(store.userLoggedIn).not.toBe(true);
    await store.authenticate({});
    expect(store.userLoggedIn).toBe(true);
  });
});



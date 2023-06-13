import useFoodStore from "@/stores/food";
import { createPinia, setActivePinia } from "pinia";
import { describe, beforeEach, test } from "vitest";

describe("Food Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  test("add food item", () => {
    
  });
});
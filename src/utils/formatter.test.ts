import { describe, it, expect } from "vitest";
import { formatPrice } from "./formatter";

describe("formatPrice", () => {
  it("formats number with comma", () => {
    expect(formatPrice(1000)).toBe("1,000");
  });

  it("formats larger number", () => {
    expect(formatPrice("2500000")).toBe("2,500,000");
  });
});

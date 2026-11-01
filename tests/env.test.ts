import { afterEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";
import { getConfig } from "@/lib/env";

const VALID_DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/DBNAME";

describe("getConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it("returns config for valid environment", () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", "1");

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "1",
    });
  });
  it('defaults DEMO_DELAY to "0"', () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", undefined);

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "0",
    });
  });
  it("throws on non-postgres URL", () => {
    vi.stubEnv("DATABASE_URL", "http://USER:PASSWORD@localhost:5432/DBNAME");
    vi.stubEnv("DEMO_DELAY", "1");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on missing DATABASE_URL", () => {
    vi.stubEnv("DATABASE_URL", undefined);
    vi.stubEnv("DEMO_DELAY", "1");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on invalid DEMO_DELAY", () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", "2");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
});

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
    vi.stubEnv("APP_VERSION", "v1.0.0");

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "1",
      APP_VERSION: "v1.0.0",
    });
  });
  it('defaults DEMO_DELAY to "0"', () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", undefined);
    vi.stubEnv("APP_VERSION", "dev");

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "0",
      APP_VERSION: "dev",
    });
  });
  it('defaults APP_VERSION to "dev"', () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", "1");
    vi.stubEnv("APP_VERSION", undefined);

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "1",
      APP_VERSION: "dev",
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
  it("throws on empty APP_VERSION", () => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", "0");
    vi.stubEnv("APP_VERSION", "");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
});

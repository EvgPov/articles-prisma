import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as z from "zod";
import { getConfig } from "@/lib/env";

const VALID_DATABASE_URL = "postgresql://USER:PASSWORD@localhost:5432/DBNAME";
const VALID_SECRET = "x".repeat(32);

describe("getConfig", () => {
  beforeEach(() => {
    vi.stubEnv("DATABASE_URL", VALID_DATABASE_URL);
    vi.stubEnv("DEMO_DELAY", "1");
    vi.stubEnv("APP_VERSION", "v1.0.0");
    vi.stubEnv("BETTER_AUTH_SECRET", VALID_SECRET);
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it("returns config for valid environment", () => {
    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "1",
      APP_VERSION: "v1.0.0",
      BETTER_AUTH_SECRET: VALID_SECRET,
      BETTER_AUTH_URL: "http://localhost:3000",
    });
  });
  it('defaults DEMO_DELAY to "0"', () => {
    vi.stubEnv("DEMO_DELAY", undefined);

    expect(getConfig()).toEqual({
      DATABASE_URL: VALID_DATABASE_URL,
      APP_VERSION: "v1.0.0",
      BETTER_AUTH_SECRET: VALID_SECRET,
      BETTER_AUTH_URL: "http://localhost:3000",
      DEMO_DELAY: "0",
    });
  });
  it('defaults APP_VERSION to "dev"', () => {
    vi.stubEnv("APP_VERSION", undefined);

    expect(getConfig()).toEqual({
      APP_VERSION: "dev",
      DATABASE_URL: VALID_DATABASE_URL,
      DEMO_DELAY: "1",
      BETTER_AUTH_SECRET: VALID_SECRET,
      BETTER_AUTH_URL: "http://localhost:3000",
    });
  });
  it("throws on non-postgres URL", () => {
    vi.stubEnv("DATABASE_URL", "http://USER:PASSWORD@localhost:5432/DBNAME");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on missing DATABASE_URL", () => {
    vi.stubEnv("DATABASE_URL", undefined);

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on missing BETTER_AUTH_URL", () => {
    vi.stubEnv("BETTER_AUTH_URL", undefined);

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on missing BETTER_AUTH_SECRET", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", undefined);

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on too short BETTER_AUTH_SECRET", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "x".repeat(31));

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on invalid DEMO_DELAY", () => {
    vi.stubEnv("DEMO_DELAY", "2");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
  it("throws on empty APP_VERSION", () => {
    vi.stubEnv("APP_VERSION", "");

    expect(() => getConfig()).toThrow(z.ZodError);
  });
});

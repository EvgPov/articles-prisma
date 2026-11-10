import * as z from "zod";

const configSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  DEMO_DELAY: z.enum(["0", "1"]).default("0"),
  APP_VERSION: z.string().min(1).default("dev"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

export function getConfig() {
  return configSchema.parse(process.env);
}

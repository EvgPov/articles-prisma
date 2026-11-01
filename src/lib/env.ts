import * as z from "zod";

const configSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  DEMO_DELAY: z.enum(["0", "1"]).default("0"),
  APP_VERSION: z.string().min(1).default("dev"),
});

export function getConfig() {
  return configSchema.parse(process.env);
}

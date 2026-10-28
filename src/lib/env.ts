import * as z from "zod"; 
 
const configSchema = z.object({ 
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  DEMO_DELAY: z.enum(['0', '1']).default('0')
});

export function getConfig() {
  return configSchema.parse(process.env)
}

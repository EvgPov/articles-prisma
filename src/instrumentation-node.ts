import * as z from "zod";
import { getConfig } from "@/lib/env";

try {
  getConfig();
} catch(err) {
  if (err instanceof z.ZodError) {
    console.error(`Invalid configuration:\n${z.prettifyError(err)}`); 
  } else {
    console.error(err)
  }
  process.exit(1)
}
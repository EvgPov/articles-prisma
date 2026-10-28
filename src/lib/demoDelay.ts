import { getConfig } from "./env";

export async function demoDelay(ms: number) {
  if (getConfig().DEMO_DELAY === '1') {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
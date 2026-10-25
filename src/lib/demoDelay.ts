export async function demoDelay(ms: number) {
  if (process.env.DEMO_DELAY === '1') {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
export function getNow(request: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = request.headers.get("x-test-now-ms");
    if (header) return Number(header);
  }
  return Date.now();
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Error: Missing required environment variable: ${name}\n` +
        "  Required vars: EVOLUTION_BASE_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE\n" +
        "  Set them via claude mcp add -e or export in your shell."
    );
    process.exit(1);
  }
  return value;
}

export const BASE_URL = getRequiredEnv("EVOLUTION_BASE_URL");
export const API_KEY = getRequiredEnv("EVOLUTION_API_KEY");
export const INSTANCE = getRequiredEnv("EVOLUTION_INSTANCE");

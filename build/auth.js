function getRequiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        console.error(`Error: Missing ${name} environment variable`);
        process.exit(1);
    }
    return value;
}
export const BASE_URL = getRequiredEnv("EVOLUTION_BASE_URL");
export const API_KEY = getRequiredEnv("EVOLUTION_API_KEY");
export const INSTANCE = getRequiredEnv("EVOLUTION_INSTANCE");

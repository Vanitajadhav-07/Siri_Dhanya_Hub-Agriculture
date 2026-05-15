// Centralized API Key Configuration
// Keys are read from environment variables (set in .env file)
// In Capacitor/Android builds, Vite injects these at build time

export const GEMINI_API_KEY: string =
  (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

export const GOOGLE_MAPS_API_KEY: string =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || "";

if (!GEMINI_API_KEY) {
  console.warn("⚠️ VITE_GEMINI_API_KEY is not set. AI features will not work.");
}

if (!GOOGLE_MAPS_API_KEY) {
  console.warn("⚠️ VITE_GOOGLE_MAPS_API_KEY is not set. Maps features will not work.");
}

console.log("Siri-Dhanya Config: Gemini key loaded:", GEMINI_API_KEY ? "✓" : "✗");
console.log("Siri-Dhanya Config: Maps key loaded:", GOOGLE_MAPS_API_KEY ? "✓" : "✗");

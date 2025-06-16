export const DEPLOYMENT_CONFIG = {
  // Production URLs
  PRODUCTION_URL: process.env.NEXT_PUBLIC_APP_URL || "https://figma-react-converter.vercel.app",

  // API Endpoints
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://figma-react-converter.vercel.app/api"
      : "http://localhost:3000/api",

  // Feature Flags
  FEATURES: {
    ANALYTICS: !!process.env.NEXT_PUBLIC_ANALYTICS_ID,
    GITHUB_INTEGRATION: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    OPENAI_INTEGRATION: !!process.env.OPENAI_API_KEY,
    GROQ_INTEGRATION: !!process.env.GROQ_API_KEY,
  },

  // Performance Settings
  PERFORMANCE: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    REQUEST_TIMEOUT: 30000, // 30 seconds
    CACHE_TTL: 3600, // 1 hour
  },

  // Security Settings
  SECURITY: {
    CORS_ORIGINS: [
      "https://figma-react-converter.vercel.app",
      "https://*.vercel.app",
      ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
    ],
    RATE_LIMIT: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
}

export const isProduction = () => process.env.NODE_ENV === "production"
export const isDevelopment = () => process.env.NODE_ENV === "development"

// Environment validation for production
export function validateProductionEnvironment() {
  const requiredVars = [
    "FIGMA_ACCESS_TOKEN",
    "NEXT_PUBLIC_GROQ_API_KEY",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
  ]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for production: ${missing.join(", ")}`)
  }

  return true
}

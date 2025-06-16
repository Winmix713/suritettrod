export const PRODUCTION_CONFIG = {
  // Required Environment Variables
  REQUIRED_ENV_VARS: [
    "FIGMA_ACCESS_TOKEN",
    "GROQ_API_KEY",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_APP_URL",
  ],

  // Optional Environment Variables
  OPTIONAL_ENV_VARS: ["OPENAI_API_KEY", "NEXT_PUBLIC_ANALYTICS_ID", "SENTRY_DSN"],

  // Security Headers
  SECURITY_HEADERS: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  },

  // Performance Settings
  PERFORMANCE: {
    MAX_REQUEST_SIZE: "10mb",
    TIMEOUT: 30000,
    CACHE_CONTROL: "public, max-age=31536000, immutable",
  },
}

export function validateProductionConfig() {
  const missing = PRODUCTION_CONFIG.REQUIRED_ENV_VARS.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true
}

import { z } from "zod"

// SECURE Environment variable schema - NO PUBLIC SENSITIVE DATA
const envSchema = z.object({
  // Figma
  FIGMA_ACCESS_TOKEN: z.string().min(1, "Figma access token is required"),

  // AI Providers (SERVER-SIDE ONLY)
  GROQ_API_KEY: z.string().min(1, "Groq API key is required"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o"),

  // GitHub Integration (SERVER-SIDE ONLY)
  GITHUB_CLIENT_ID: z.string().min(1, "GitHub client ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GitHub client secret is required"),

  // Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXTAUTH_SECRET: z.string().min(1, "NextAuth secret is required"),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_GROQ_API_KEY: z.string().min(1, "Public Groq API key is required"),
})

export type Environment = z.infer<typeof envSchema>

export class EnvironmentValidator {
  private static instance: EnvironmentValidator
  private env: Environment

  private constructor() {
    // Only validate on server-side
    if (typeof window === "undefined") {
      this.env = this.validateEnvironment()
    } else {
      // Client-side fallback
      this.env = {} as Environment
    }
  }

  public static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator()
    }
    return EnvironmentValidator.instance
  }

  private validateEnvironment(): Environment {
    try {
      const env = {
        // Figma
        FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN,

        // AI Providers (SERVER-SIDE ONLY)
        GROQ_API_KEY: process.env.GROQ_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o",

        // GitHub (SERVER-SIDE ONLY)
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

        // Application
        NODE_ENV: process.env.NODE_ENV || "development",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_GROQ_API_KEY: process.env.NEXT_PUBLIC_GROQ_API_KEY,
      }

      return envSchema.parse(env)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n")
        console.error(`❌ Environment validation failed:\n${missingVars}`)
        // In production, we'll continue with partial config to avoid breaking the app
        if (process.env.NODE_ENV === "production") {
          return env as Environment
        }
        throw new Error(`❌ Environment validation failed:\n${missingVars}`)
      }
      throw error
    }
  }

  public getEnv(): Environment {
    return this.env
  }

  public isProduction(): boolean {
    return this.env.NODE_ENV === "production"
  }

  public isDevelopment(): boolean {
    return this.env.NODE_ENV === "development"
  }

  // Server-side only checks
  public hasGroq(): boolean {
    if (typeof window !== "undefined") return false // Never check on client
    return !!this.env.GROQ_API_KEY
  }

  public hasOpenAI(): boolean {
    if (typeof window !== "undefined") return false // Never check on client
    return !!this.env.OPENAI_API_KEY
  }

  public hasGitHub(): boolean {
    if (typeof window !== "undefined") return false // Never check on client
    return !!(this.env.GITHUB_CLIENT_ID && this.env.GITHUB_CLIENT_SECRET)
  }
}

// Export singleton instance
export const env = EnvironmentValidator.getInstance()

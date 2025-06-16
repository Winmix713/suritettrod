import { groq } from "@ai-sdk/groq"

// Groq Client class for server-side operations
export class GroqClient {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || null
  }

  // Check if Groq is configured
  isConfigured(): boolean {
    return !!this.apiKey
  }

  // Get Groq model instance
  getModel() {
    if (!this.apiKey) {
      throw new Error("Groq API key not found. Please set GROQ_API_KEY environment variable.")
    }

    return groq("llama-3.1-70b-versatile", {
      apiKey: this.apiKey,
    })
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) return false

      const model = this.getModel()
      const { generateText } = await import("ai")

      const result = await generateText({
        model,
        prompt: 'Say "Hello" if you can hear me.',
        maxTokens: 10,
      })

      return result.text.toLowerCase().includes("hello")
    } catch (error) {
      console.error("Groq connection test failed:", error)
      return false
    }
  }

  // Generate text with Groq
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error("Groq not configured")
      }

      const model = this.getModel()
      const { generateText } = await import("ai")

      const result = await generateText({
        model,
        prompt: prompt,
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      })

      return result.text
    } catch (error) {
      console.error("Groq text generation failed:", error)
      throw error
    }
  }

  // Generate code with Groq
  async generateCode(prompt: string): Promise<string> {
    return this.generateText(`Generate React component code for: ${prompt}`, { temperature: 0.2 })
  }
}

// Server-side Groq client configuration (legacy support)
export const getGroqModel = () => {
  const client = new GroqClient()
  return client.getModel()
}

// Validate API key format
export const validateGroqKey = (key: string): boolean => {
  return key.startsWith("gsk_") && key.length > 20
}

// Test API connection
export const testGroqConnection = async (): Promise<boolean> => {
  const client = new GroqClient()
  return client.testConnection()
}

// Client-safe configuration check
export const hasGroqConfigured = (): boolean => {
  if (typeof window === "undefined") {
    const client = new GroqClient()
    return client.isConfigured()
  }
  return false
}

// Default export
export default GroqClient

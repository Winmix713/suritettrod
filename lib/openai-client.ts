import { openai } from "@ai-sdk/openai"

// OpenAI Client class for server-side operations
export class OpenAIClient {
  private apiKey: string | null = null
  private model = "gpt-4o"

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || null
    this.model = process.env.OPENAI_MODEL || "gpt-4o"
  }

  // Check if OpenAI is configured
  isConfigured(): boolean {
    return !!this.apiKey
  }

  // Get OpenAI model instance
  getModel() {
    if (!this.apiKey) {
      throw new Error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable.")
    }

    return openai(this.model, {
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
      console.error("OpenAI connection test failed:", error)
      return false
    }
  }

  // Generate text with OpenAI
  async generateText(prompt: string, options: any = {}): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error("OpenAI not configured")
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
      console.error("OpenAI text generation failed:", error)
      throw error
    }
  }

  // Generate code with OpenAI
  async generateCode(prompt: string): Promise<string> {
    return this.generateText(`Generate React component code for: ${prompt}`, { temperature: 0.2 })
  }
}

// Server-side OpenAI client configuration (legacy support)
export const getOpenAIModel = () => {
  const client = new OpenAIClient()
  return client.getModel()
}

// Validate API key format (server-side only)
export const validateOpenAIKey = (key: string): boolean => {
  return key.startsWith("sk-") && key.length > 20
}

// Test API connection (server-side only)
export const testOpenAIConnection = async (): Promise<boolean> => {
  const client = new OpenAIClient()
  return client.testConnection()
}

// Client-safe configuration check
export const hasOpenAIConfigured = (): boolean => {
  // Only check if we're on server-side
  if (typeof window === "undefined") {
    const client = new OpenAIClient()
    return client.isConfigured()
  }
  // On client-side, we can't check directly
  return false
}

// Default export
export default OpenAIClient

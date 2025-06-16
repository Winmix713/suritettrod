import { type NextRequest, NextResponse } from "next/server"
import { GroqClient } from "@/lib/groq-client"
import { OpenAIClient } from "@/lib/openai-client"

export const maxDuration = 60 // Set max duration to 60 seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider = "groq", options = {} } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    let result: string

    if (provider === "groq") {
      const groqClient = new GroqClient()
      result = await groqClient.generateText(prompt, options)
    } else if (provider === "openai") {
      const openaiClient = new OpenAIClient()
      result = await openaiClient.generateText(prompt, options)
    } else {
      return NextResponse.json({ error: "Invalid AI provider" }, { status: 400 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI generation failed" },
      { status: 500 },
    )
  }
}

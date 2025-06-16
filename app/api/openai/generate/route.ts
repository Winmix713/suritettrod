import { type NextRequest, NextResponse } from "next/server"
import { OpenAIClient } from "@/lib/openai-client"

export const maxDuration = 60 // Set max duration to 60 seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    const { prompt, options = {} } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const openaiClient = new OpenAIClient()

    if (!openaiClient.isConfigured()) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const result = await openaiClient.generateText(prompt, options)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("OpenAI generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "OpenAI generation failed" },
      { status: 500 },
    )
  }
}

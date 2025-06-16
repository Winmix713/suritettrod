import { type NextRequest, NextResponse } from "next/server"
import { GroqClient } from "@/lib/groq-client"

export const maxDuration = 60 // Set max duration to 60 seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    const { prompt, options = {} } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const groqClient = new GroqClient()

    if (!groqClient.isConfigured()) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 })
    }

    const result = await groqClient.generateText(prompt, options)
    return NextResponse.json({ result })
  } catch (error) {
    console.error("Groq generation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Groq generation failed" },
      { status: 500 },
    )
  }
}

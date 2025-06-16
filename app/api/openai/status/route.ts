import { NextResponse } from "next/server"
import { testOpenAIConnection, hasOpenAIConfigured } from "@/lib/openai-client"

export async function GET() {
  try {
    const isConfigured = hasOpenAIConfigured()

    if (!isConfigured) {
      return NextResponse.json({
        configured: false,
        status: "not_configured",
        message: "OpenAI API key not configured",
      })
    }

    const isWorking = await testOpenAIConnection()

    return NextResponse.json({
      configured: true,
      status: isWorking ? "working" : "error",
      message: isWorking ? "OpenAI API is working" : "OpenAI API connection failed",
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        status: "error",
        message: "Failed to check OpenAI status",
      },
      { status: 500 },
    )
  }
}

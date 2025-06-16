import { NextResponse } from "next/server"
import { testGroqConnection } from "@/lib/groq-client"

export async function GET() {
  try {
    const hasApiKey = !!process.env.GROQ_API_KEY

    if (!hasApiKey) {
      return NextResponse.json({
        configured: false,
        status: "missing",
        message: "Groq API key not configured",
      })
    }

    // Test connection
    const isWorking = await testGroqConnection()

    return NextResponse.json({
      configured: true,
      status: isWorking ? "working" : "error",
      message: isWorking ? "Groq API is working" : "Groq API connection failed",
    })
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        status: "error",
        message: "Failed to check Groq status",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"
import { testFigmaConnection } from "@/lib/figma-config"
import { testGroqConnection } from "@/lib/groq-client"
import { testOpenAIConnection, hasOpenAIConfigured } from "@/lib/openai-client"

export const maxDuration = 10 // Set max duration to 10 seconds for Vercel

export async function GET() {
  try {
    // Check Figma API status
    const figmaConfigured = !!process.env.FIGMA_ACCESS_TOKEN
    let figmaWorking = false

    if (figmaConfigured) {
      try {
        figmaWorking = await testFigmaConnection()
      } catch (error) {
        console.error("Error testing Figma connection:", error)
      }
    }

    // Check Groq API status
    const groqConfigured = !!process.env.GROQ_API_KEY
    let groqWorking = false

    if (groqConfigured) {
      try {
        groqWorking = await testGroqConnection()
      } catch (error) {
        console.error("Error testing Groq connection:", error)
      }
    }

    // Check OpenAI API status
    const openaiConfigured = hasOpenAIConfigured()
    let openaiWorking = false

    if (openaiConfigured) {
      try {
        openaiWorking = await testOpenAIConnection()
      } catch (error) {
        console.error("Error testing OpenAI connection:", error)
      }
    }

    // Check GitHub OAuth configuration
    const githubConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)

    return NextResponse.json({
      figma: {
        configured: figmaConfigured,
        working: figmaWorking,
        status: figmaConfigured ? (figmaWorking ? "working" : "error") : "not_configured",
      },
      groq: {
        configured: groqConfigured,
        working: groqWorking,
        status: groqConfigured ? (groqWorking ? "working" : "error") : "not_configured",
      },
      openai: {
        configured: openaiConfigured,
        working: openaiWorking,
        status: openaiConfigured ? (openaiWorking ? "working" : "error") : "optional",
      },
      github: {
        configured: githubConfigured,
        status: githubConfigured ? "configured" : "not_configured",
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        nextAuthConfigured: !!process.env.NEXTAUTH_SECRET,
      },
    })
  } catch (error) {
    console.error("Error checking environment status:", error)
    return NextResponse.json(
      {
        error: "Failed to check environment status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

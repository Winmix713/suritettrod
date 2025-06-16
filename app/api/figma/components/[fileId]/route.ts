import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30 // Set max duration to 30 seconds for Vercel

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const { fileId } = params

    // Get Figma token from server environment
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN
    if (!figmaToken) {
      return NextResponse.json({ error: "Figma access token not configured" }, { status: 500 })
    }

    console.log(`Fetching Figma components for file: ${fileId}`)

    const response = await fetch(`https://api.figma.com/v1/files/${fileId}/components`, {
      headers: {
        "X-Figma-Token": figmaToken,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error(`Failed to load components: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: `Failed to load components: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Figma components API error:", error)
    return NextResponse.json({ error: "Failed to fetch Figma components" }, { status: 500 })
  }
}

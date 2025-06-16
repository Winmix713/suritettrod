import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { fileId: string } }) {
  try {
    const { fileId } = params
    const { searchParams } = new URL(request.url)

    // Get Figma token from server environment
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN
    if (!figmaToken) {
      return NextResponse.json({ error: "Figma access token not configured" }, { status: 500 })
    }

    // Build query parameters
    const queryParams = new URLSearchParams()
    if (searchParams.get("version")) queryParams.append("version", searchParams.get("version")!)
    if (searchParams.get("ids")) queryParams.append("ids", searchParams.get("ids")!)
    if (searchParams.get("depth")) queryParams.append("depth", searchParams.get("depth")!)
    if (searchParams.get("geometry")) queryParams.append("geometry", searchParams.get("geometry")!)
    if (searchParams.get("plugin_data")) queryParams.append("plugin_data", searchParams.get("plugin_data")!)
    if (searchParams.get("branch_data")) queryParams.append("branch_data", "true")

    const url = `https://api.figma.com/v1/files/${fileId}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    console.log(`Fetching Figma file: ${url}`)

    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": figmaToken,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error(`Figma API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Figma API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Figma API error:", error)
    return NextResponse.json({ error: "Failed to fetch Figma file" }, { status: 500 })
  }
}

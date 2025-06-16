// Update Figma configuration to use environment variables for Vercel deployment
export const FIGMA_CONFIG = {
  TOKEN: process.env.FIGMA_ACCESS_TOKEN || "",
  API_BASE_URL: "https://api.figma.com/v1",
  STORAGE_KEY: "figma-token",
  CONNECTION_STATUS_KEY: "figma-connection-status",
}

export interface FigmaFileResponse {
  document: any
  components: any
  schemaVersion: number
  styles: any
  name: string
  lastModified: string
  thumbnailUrl: string
  version: string
  role: string
  editorType: string
  linkAccess: string
}

// Token initialization and validation
export async function initializeFigmaToken(): Promise<boolean> {
  try {
    // Check if token exists in localStorage for client-side
    const existingToken = typeof window !== "undefined" ? localStorage.getItem(FIGMA_CONFIG.STORAGE_KEY) : null

    if (typeof window !== "undefined" && !existingToken) {
      // If no token in localStorage, set the default from environment
      localStorage.setItem(FIGMA_CONFIG.STORAGE_KEY, FIGMA_CONFIG.TOKEN)
      console.log("✅ Figma token automatically set from environment")
    }

    // Test connection
    const isConnected = await testFigmaConnection()

    // Save status
    if (typeof window !== "undefined") {
      localStorage.setItem(FIGMA_CONFIG.CONNECTION_STATUS_KEY, isConnected.toString())
    }

    return isConnected
  } catch (error) {
    console.error("❌ Figma token initialization failed:", error)
    if (typeof window !== "undefined") {
      localStorage.setItem(FIGMA_CONFIG.CONNECTION_STATUS_KEY, "false")
    }
    return false
  }
}

// Test API connection
export async function testFigmaConnection(): Promise<boolean> {
  try {
    // Use environment token for server-side or localStorage for client-side
    const token = typeof window !== "undefined" ? localStorage.getItem(FIGMA_CONFIG.STORAGE_KEY) : FIGMA_CONFIG.TOKEN

    if (!token) return false

    const response = await fetch(`${FIGMA_CONFIG.API_BASE_URL}/me`, {
      headers: {
        "X-Figma-Token": token,
      },
    })

    if (response.ok) {
      const userData = await response.json()
      console.log("✅ Figma API connection successful:", userData.email)
      return true
    } else {
      console.warn("⚠️ Figma API connection failed:", response.status)
      return false
    }
  } catch (error) {
    console.error("❌ Figma API connection error:", error)
    return false
  }
}

// Get token
export function getFigmaToken(): string | null {
  // Use environment token for server-side or localStorage for client-side
  return typeof window !== "undefined" ? localStorage.getItem(FIGMA_CONFIG.STORAGE_KEY) : FIGMA_CONFIG.TOKEN
}

// Get connection status
export function getFigmaConnectionStatus(): boolean {
  if (typeof window !== "undefined") {
    const status = localStorage.getItem(FIGMA_CONFIG.CONNECTION_STATUS_KEY)
    return status === "true"
  }
  // For server-side, assume connected if token exists
  return !!FIGMA_CONFIG.TOKEN
}

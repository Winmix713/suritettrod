// Enhanced Figma Service - COMPLETELY SERVER-SIDE ONLY

import type {
  FigmaAPIResponse,
  FigmaAPIConfig,
  FigmaFileRequest,
  FigmaImageRequest,
  FigmaImageResponse,
} from "@/lib/figma-types"

export class FigmaService {
  private config: FigmaAPIConfig
  private cache = new Map<string, any>()
  private rateLimitDelay = 1000 // 1 second between requests

  constructor(config: Partial<FigmaAPIConfig> = {}) {
    // ONLY server-side token access - NO client-side token references
    this.config = {
      token: config.token || (typeof window === "undefined" ? process.env.FIGMA_ACCESS_TOKEN : "") || "",
      baseUrl: config.baseUrl || "https://api.figma.com/v1",
      timeout: config.timeout || 30000,
      retryAttempts: config.retryAttempts || 3,
    }
  }

  // Set or update the Figma token - SERVER-SIDE ONLY
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      throw new Error("Token operations must be performed server-side only")
    }
    this.config.token = token
    this.cache.clear()
  }

  // Test API connection - SERVER-SIDE ONLY
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    if (typeof window !== "undefined") {
      throw new Error("Figma API calls must be made server-side only")
    }

    try {
      const response = await this.makeRequest("/me")
      return { success: response.ok }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Get Figma file data - SERVER-SIDE ONLY
  async getFile(request: FigmaFileRequest): Promise<FigmaAPIResponse> {
    if (typeof window !== "undefined") {
      throw new Error("Figma API calls must be made server-side only")
    }

    const cacheKey = `file-${request.fileId}-${JSON.stringify(request)}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const params = new URLSearchParams()
    if (request.version) params.append("version", request.version)
    if (request.ids) params.append("ids", request.ids.join(","))
    if (request.depth) params.append("depth", request.depth.toString())
    if (request.geometry) params.append("geometry", request.geometry)
    if (request.plugin_data) params.append("plugin_data", request.plugin_data)
    if (request.branch_data) params.append("branch_data", "true")

    const url = `/files/${request.fileId}${params.toString() ? `?${params.toString()}` : ""}`
    const response = await this.makeRequest(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma file: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    this.cache.set(cacheKey, data)

    return data
  }

  // Get images from Figma file - SERVER-SIDE ONLY
  async getImages(request: FigmaImageRequest): Promise<FigmaImageResponse> {
    if (typeof window !== "undefined") {
      throw new Error("Figma API calls must be made server-side only")
    }

    const params = new URLSearchParams({
      ids: request.ids.join(","),
      scale: request.scale.toString(),
      format: request.format,
    })

    if (request.svg_include_id) params.append("svg_include_id", "true")
    if (request.svg_simplify_stroke) params.append("svg_simplify_stroke", "true")
    if (request.use_absolute_bounds) params.append("use_absolute_bounds", "true")
    if (request.version) params.append("version", request.version)

    const url = `/images/${request.fileId}?${params.toString()}`
    const response = await this.makeRequest(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma images: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  // Extract file ID from Figma URL - CLIENT-SAFE UTILITY
  static extractFileId(url: string): string | null {
    const patterns = [
      /figma\.com\/file\/([a-zA-Z0-9]+)/,
      /figma\.com\/design\/([a-zA-Z0-9]+)/,
      /figma\.com\/proto\/([a-zA-Z0-9]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }

    return null
  }

  // Validate Figma URL - CLIENT-SAFE UTILITY
  static isValidFigmaUrl(url: string): boolean {
    return this.extractFileId(url) !== null
  }

  // Private method to make API requests - SERVER-SIDE ONLY
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (typeof window !== "undefined") {
      throw new Error("Figma API calls must be made server-side only")
    }

    if (!this.config.token) {
      throw new Error("Figma API token is required")
    }

    const url = `${this.config.baseUrl}${endpoint}`
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        "X-Figma-Token": this.config.token,
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout),
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (attempt > 1) {
          await this.delay(this.rateLimitDelay * attempt)
        }

        const response = await fetch(url, requestOptions)

        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After")
          const delay = retryAfter ? Number.parseInt(retryAfter) * 1000 : this.rateLimitDelay * attempt
          await this.delay(delay)
          continue
        }

        return response
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error")

        if (error instanceof TypeError && error.message.includes("fetch")) {
          break
        }
      }
    }

    throw lastError || new Error("Request failed after all retry attempts")
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  clearCache(): void {
    this.cache.clear()
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Export singleton instance - SERVER-SIDE ONLY
export const figmaService = typeof window === "undefined" ? new FigmaService() : null

// Export utility functions - CLIENT-SAFE
export const { extractFileId, isValidFigmaUrl } = FigmaService

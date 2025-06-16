import { describe, it, expect, vi, beforeEach } from "vitest"
import { FigmaApiService } from "@/services/figma-api-service"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("FigmaApiService", () => {
  const mockAccessToken = "test-access-token"
  const mockFileKey = "test-file-key"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getFile", () => {
    it("successfully fetches file data", async () => {
      const result = await FigmaApiService.getFile(mockFileKey, mockAccessToken)

      expect(result).toEqual(
        expect.objectContaining({
          name: "Test File",
          document: expect.objectContaining({
            id: "0:0",
            name: "Test Document",
            type: "DOCUMENT",
          }),
        }),
      )
    })

    it("handles API errors", async () => {
      server.use(
        http.get("https://api.figma.com/v1/files/:fileKey", () => {
          return HttpResponse.json({ status: 404, err: "File not found" }, { status: 404 })
        }),
      )

      await expect(FigmaApiService.getFile("invalid-key", mockAccessToken)).rejects.toThrow("File not found")
    })

    it("handles network errors", async () => {
      server.use(
        http.get("https://api.figma.com/v1/files/:fileKey", () => {
          return HttpResponse.error()
        }),
      )

      await expect(FigmaApiService.getFile(mockFileKey, mockAccessToken)).rejects.toThrow()
    })
  })

  describe("getFileImages", () => {
    it("successfully fetches file images", async () => {
      const nodeIds = ["3:1"]
      const result = await FigmaApiService.getFileImages(mockFileKey, nodeIds, mockAccessToken)

      expect(result).toEqual(
        expect.objectContaining({
          images: expect.objectContaining({
            "3:1": "https://example.com/image1.png",
          }),
        }),
      )
    })

    it("handles missing node IDs", async () => {
      await expect(FigmaApiService.getFileImages(mockFileKey, [], mockAccessToken)).rejects.toThrow(
        "Node IDs are required",
      )
    })
  })

  describe("getTeamComponents", () => {
    it("successfully fetches team components", async () => {
      const teamId = "test-team-id"
      const result = await FigmaApiService.getTeamComponents(teamId, mockAccessToken)

      expect(result).toEqual(
        expect.objectContaining({
          meta: expect.objectContaining({
            components: expect.arrayContaining([
              expect.objectContaining({
                key: "test-component-key",
                name: "Button Component",
              }),
            ]),
          }),
        }),
      )
    })

    it("handles invalid team ID", async () => {
      server.use(
        http.get("https://api.figma.com/v1/teams/:teamId/components", () => {
          return HttpResponse.json({ status: 403, err: "Forbidden" }, { status: 403 })
        }),
      )

      await expect(FigmaApiService.getTeamComponents("invalid-team", mockAccessToken)).rejects.toThrow("Forbidden")
    })
  })

  describe("validateAccessToken", () => {
    it("validates correct access token format", () => {
      const validToken = "figd_1234567890abcdef"
      expect(FigmaApiService.validateAccessToken(validToken)).toBe(true)
    })

    it("rejects invalid access token format", () => {
      const invalidToken = "invalid-token"
      expect(FigmaApiService.validateAccessToken(invalidToken)).toBe(false)
    })

    it("rejects empty access token", () => {
      expect(FigmaApiService.validateAccessToken("")).toBe(false)
    })
  })

  describe("parseFileKey", () => {
    it("extracts file key from full Figma URL", () => {
      const url = "https://www.figma.com/file/ABC123/Test-File"
      const result = FigmaApiService.parseFileKey(url)
      expect(result).toBe("ABC123")
    })

    it("returns file key if already in correct format", () => {
      const fileKey = "ABC123"
      const result = FigmaApiService.parseFileKey(fileKey)
      expect(result).toBe("ABC123")
    })

    it("handles invalid URL format", () => {
      const invalidUrl = "https://example.com/invalid"
      expect(() => FigmaApiService.parseFileKey(invalidUrl)).toThrow("Invalid Figma URL")
    })
  })

  describe("rate limiting", () => {
    it("respects rate limits", async () => {
      const startTime = Date.now()

      // Make multiple requests
      await Promise.all([
        FigmaApiService.getFile(mockFileKey, mockAccessToken),
        FigmaApiService.getFile(mockFileKey, mockAccessToken),
        FigmaApiService.getFile(mockFileKey, mockAccessToken),
      ])

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should take at least some time due to rate limiting
      expect(duration).toBeGreaterThan(100)
    })
  })
})

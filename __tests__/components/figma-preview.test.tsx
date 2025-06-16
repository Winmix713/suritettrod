import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "../utils/test-utils"
import { FigmaPreview } from "@/components/figma/figma-preview"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("FigmaPreview", () => {
  const mockProps = {
    fileKey: "test-file-key",
    nodeId: "1:1",
    accessToken: "test-token",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders loading state initially", () => {
    render(<FigmaPreview {...mockProps} />)

    expect(screen.getByText("Loading Figma preview...")).toBeInTheDocument()
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("renders preview after successful data fetch", async () => {
    render(<FigmaPreview {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Test Document")).toBeInTheDocument()
    })

    expect(screen.getByText("Frame 1")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /zoom in/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /zoom out/i })).toBeInTheDocument()
  })

  it("handles API errors gracefully", async () => {
    server.use(
      http.get("https://api.figma.com/v1/files/:fileKey", () => {
        return HttpResponse.json({ status: 404, err: "File not found" }, { status: 404 })
      }),
    )

    render(<FigmaPreview {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load figma file/i)).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("allows zoom controls interaction", async () => {
    render(<FigmaPreview {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Test Document")).toBeInTheDocument()
    })

    const zoomInButton = screen.getByRole("button", { name: /zoom in/i })
    const zoomOutButton = screen.getByRole("button", { name: /zoom out/i })

    expect(zoomInButton).toBeInTheDocument()
    expect(zoomOutButton).toBeInTheDocument()

    // Test zoom functionality
    zoomInButton.click()
    expect(screen.getByText("110%")).toBeInTheDocument()

    zoomOutButton.click()
    zoomOutButton.click()
    expect(screen.getByText("90%")).toBeInTheDocument()
  })

  it("toggles fullscreen mode", async () => {
    render(<FigmaPreview {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Test Document")).toBeInTheDocument()
    })

    const fullscreenButton = screen.getByRole("button", { name: /fullscreen/i })
    fullscreenButton.click()

    expect(screen.getByRole("button", { name: /exit fullscreen/i })).toBeInTheDocument()
  })

  it("handles node selection", async () => {
    const onNodeSelect = vi.fn()
    render(<FigmaPreview {...mockProps} onNodeSelect={onNodeSelect} />)

    await waitFor(() => {
      expect(screen.getByText("Test Document")).toBeInTheDocument()
    })

    // Simulate clicking on a node
    const frameElement = screen.getByText("Frame 1")
    frameElement.click()

    expect(onNodeSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "2:1",
        name: "Frame 1",
        type: "FRAME",
      }),
    )
  })

  it("shows node properties when node is selected", async () => {
    render(<FigmaPreview {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Test Document")).toBeInTheDocument()
    })

    // Click on a node to select it
    const frameElement = screen.getByText("Frame 1")
    frameElement.click()

    await waitFor(() => {
      expect(screen.getByText("Node Properties")).toBeInTheDocument()
      expect(screen.getByText("Type: FRAME")).toBeInTheDocument()
      expect(screen.getByText("Size: 375 × 812")).toBeInTheDocument()
    })
  })

  it("handles missing access token", () => {
    render(<FigmaPreview {...mockProps} accessToken="" />)

    expect(screen.getByText(/figma access token is required/i)).toBeInTheDocument()
  })

  it("handles invalid file key format", () => {
    render(<FigmaPreview {...mockProps} fileKey="invalid-format" />)

    expect(screen.getByText(/invalid figma file key format/i)).toBeInTheDocument()
  })
})

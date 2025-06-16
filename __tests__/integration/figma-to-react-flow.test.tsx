import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "../utils/test-utils"
import { FigmaConverter } from "@/components/figma-converter"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("Figma to React Conversion Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("completes full conversion flow", async () => {
    render(<FigmaConverter />)

    // Step 1: Enter Figma URL and access token
    const urlInput = screen.getByPlaceholderText(/figma file url/i)
    const tokenInput = screen.getByPlaceholderText(/access token/i)

    fireEvent.change(urlInput, {
      target: { value: "https://www.figma.com/file/test-file-key/Test-File" },
    })
    fireEvent.change(tokenInput, {
      target: { value: "figd_test-access-token" },
    })

    const connectButton = screen.getByRole("button", { name: /connect to figma/i })
    fireEvent.click(connectButton)

    // Wait for connection to establish
    await waitFor(() => {
      expect(screen.getByText(/connected to figma/i)).toBeInTheDocument()
    })

    // Step 2: Select components
    await waitFor(() => {
      expect(screen.getByText("Frame 1")).toBeInTheDocument()
    })

    const selectButton = screen.getByRole("button", { name: /select for conversion/i })
    fireEvent.click(selectButton)

    // Step 3: Configure AI settings
    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText(/ai configuration/i)).toBeInTheDocument()
    })

    const generateButton = screen.getByRole("button", { name: /generate react code/i })
    fireEvent.click(generateButton)

    // Step 4: Wait for code generation
    await waitFor(
      () => {
        expect(screen.getByText(/code generated successfully/i)).toBeInTheDocument()
      },
      { timeout: 10000 },
    )

    // Step 5: Verify generated code
    expect(screen.getByText("GeneratedComponent")).toBeInTheDocument()
    expect(screen.getByText(/export function GeneratedComponent/)).toBeInTheDocument()

    // Step 6: Export options
    const exportButton = screen.getByRole("button", { name: /export/i })
    fireEvent.click(exportButton)

    await waitFor(() => {
      expect(screen.getByText(/export successful/i)).toBeInTheDocument()
    })
  })

  it("handles errors gracefully during conversion", async () => {
    // Mock API error
    server.use(
      http.get("https://api.figma.com/v1/files/:fileKey", () => {
        return HttpResponse.json({ status: 500, err: "Internal server error" }, { status: 500 })
      }),
    )

    render(<FigmaConverter />)

    const urlInput = screen.getByPlaceholderText(/figma file url/i)
    const tokenInput = screen.getByPlaceholderText(/access token/i)

    fireEvent.change(urlInput, {
      target: { value: "https://www.figma.com/file/test-file-key/Test-File" },
    })
    fireEvent.change(tokenInput, {
      target: { value: "figd_test-access-token" },
    })

    const connectButton = screen.getByRole("button", { name: /connect to figma/i })
    fireEvent.click(connectButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to connect to figma/i)).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("validates user inputs", async () => {
    render(<FigmaConverter />)

    // Try to connect without URL
    const connectButton = screen.getByRole("button", { name: /connect to figma/i })
    fireEvent.click(connectButton)

    expect(screen.getByText(/figma url is required/i)).toBeInTheDocument()

    // Try with invalid URL
    const urlInput = screen.getByPlaceholderText(/figma file url/i)
    fireEvent.change(urlInput, { target: { value: "invalid-url" } })
    fireEvent.click(connectButton)

    expect(screen.getByText(/invalid figma url/i)).toBeInTheDocument()

    // Try with invalid token
    fireEvent.change(urlInput, {
      target: { value: "https://www.figma.com/file/test-file-key/Test-File" },
    })

    const tokenInput = screen.getByPlaceholderText(/access token/i)
    fireEvent.change(tokenInput, { target: { value: "invalid-token" } })
    fireEvent.click(connectButton)

    expect(screen.getByText(/invalid access token format/i)).toBeInTheDocument()
  })
})

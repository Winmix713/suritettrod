import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "../utils/test-utils"
import { ComponentLibrary } from "@/components/figma/component-library"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("ComponentLibrary", () => {
  const mockProps = {
    teamId: "test-team-id",
    accessToken: "test-token",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders loading state initially", () => {
    render(<ComponentLibrary {...mockProps} />)

    expect(screen.getByText("Loading components...")).toBeInTheDocument()
  })

  it("renders components after successful fetch", async () => {
    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    expect(screen.getByText("A test button component")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /download/i })).toBeInTheDocument()
  })

  it("handles search functionality", async () => {
    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/search components/i)
    fireEvent.change(searchInput, { target: { value: "Button" } })

    expect(screen.getByText("Button Component")).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: "NonExistent" } })
    expect(screen.getByText(/no components found/i)).toBeInTheDocument()
  })

  it("toggles between grid and list view", async () => {
    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    const listViewButton = screen.getByRole("button", { name: /list view/i })
    fireEvent.click(listViewButton)

    // Check if layout changed (this would depend on CSS classes or data attributes)
    expect(screen.getByTestId("component-list")).toHaveClass("list-view")

    const gridViewButton = screen.getByRole("button", { name: /grid view/i })
    fireEvent.click(gridViewButton)

    expect(screen.getByTestId("component-list")).toHaveClass("grid-view")
  })

  it("handles component download", async () => {
    const onComponentSelect = vi.fn()
    render(<ComponentLibrary {...mockProps} onComponentSelect={onComponentSelect} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    const downloadButton = screen.getByRole("button", { name: /download/i })
    fireEvent.click(downloadButton)

    expect(onComponentSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "test-component-key",
        name: "Button Component",
      }),
    )
  })

  it("handles favorites functionality", async () => {
    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    const favoriteButton = screen.getByRole("button", { name: /add to favorites/i })
    fireEvent.click(favoriteButton)

    expect(screen.getByRole("button", { name: /remove from favorites/i })).toBeInTheDocument()
  })

  it("filters by category", async () => {
    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText("Button Component")).toBeInTheDocument()
    })

    const categoryFilter = screen.getByRole("combobox", { name: /category/i })
    fireEvent.click(categoryFilter)

    const buttonCategory = screen.getByRole("option", { name: /buttons/i })
    fireEvent.click(buttonCategory)

    expect(screen.getByText("Button Component")).toBeInTheDocument()
  })

  it("handles API errors", async () => {
    server.use(
      http.get("https://api.figma.com/v1/teams/:teamId/components", () => {
        return HttpResponse.json({ status: 403, err: "Forbidden" }, { status: 403 })
      }),
    )

    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText(/failed to load components/i)).toBeInTheDocument()
    })

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
  })

  it("shows empty state when no components available", async () => {
    server.use(
      http.get("https://api.figma.com/v1/teams/:teamId/components", () => {
        return HttpResponse.json({ meta: { components: [] } })
      }),
    )

    render(<ComponentLibrary {...mockProps} />)

    await waitFor(() => {
      expect(screen.getByText(/no components found/i)).toBeInTheDocument()
    })
  })

  it("handles missing access token", () => {
    render(<ComponentLibrary {...mockProps} accessToken="" />)

    expect(screen.getByText(/access token is required/i)).toBeInTheDocument()
  })
})

import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FigmaConnectionProvider } from "@/components/figma-connection-provider"

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="figma-converter-theme">
        <FigmaConnectionProvider>
          {children}
          <Toaster />
        </FigmaConnectionProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

// Test data factories
export const createMockFigmaNode = (overrides = {}) => ({
  id: "1:1",
  name: "Test Node",
  type: "FRAME",
  children: [],
  absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
  backgroundColor: { r: 1, g: 1, b: 1, a: 1 },
  ...overrides,
})

export const createMockFigmaFile = (overrides = {}) => ({
  name: "Test File",
  lastModified: "2024-01-01T00:00:00.000Z",
  thumbnailUrl: "https://example.com/thumb.png",
  version: "1",
  document: {
    id: "0:0",
    name: "Document",
    type: "DOCUMENT",
    children: [createMockFigmaNode()],
  },
  components: {},
  styles: {},
  schemaVersion: 0,
  ...overrides,
})

export const createMockComponent = (overrides = {}) => ({
  componentName: "TestComponent",
  jsx: "<div>Test Component</div>",
  css: ".test { color: red; }",
  typescript: "export interface TestProps {}",
  figmaUrl: "https://figma.com/test",
  ...overrides,
})

// Wait for async operations
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0))

// Mock user interactions
export const mockUserEvent = {
  click: (element: Element) => element.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  type: (element: Element, text: string) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = text
      element.dispatchEvent(new Event("input", { bubbles: true }))
    }
  },
  clear: (element: Element) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = ""
      element.dispatchEvent(new Event("input", { bubbles: true }))
    }
  },
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Layers,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { FigmaNode, FigmaFile } from "@/lib/figma-types"

interface FigmaPreviewProps {
  figmaUrl?: string
  fileKey?: string
  nodeId?: string
  className?: string
  showControls?: boolean
  showLayers?: boolean
  onNodeSelect?: (node: FigmaNode) => void
  onError?: (error: string) => void
}

interface PreviewState {
  isLoading: boolean
  error: string | null
  figmaData: FigmaFile | null
  selectedNode: FigmaNode | null
  zoom: number
  rotation: number
  showGrid: boolean
  isFullscreen: boolean
}

export function FigmaPreview({
  figmaUrl,
  fileKey,
  nodeId,
  className,
  showControls = true,
  showLayers = false,
  onNodeSelect,
  onError,
}: FigmaPreviewProps) {
  const [state, setState] = useState<PreviewState>({
    isLoading: false,
    error: null,
    figmaData: null,
    selectedNode: null,
    zoom: 100,
    rotation: 0,
    showGrid: false,
    isFullscreen: false,
  })

  const previewRef = useRef<HTMLDivElement>(null)

  // Extract file key from URL if provided
  const extractedFileKey = figmaUrl ? extractFileKeyFromUrl(figmaUrl) : fileKey

  useEffect(() => {
    if (extractedFileKey) {
      loadFigmaFile(extractedFileKey)
    }
  }, [extractedFileKey])

  const loadFigmaFile = async (key: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Use SECURE API endpoint - NO direct Figma API calls from client
      const response = await fetch(`/api/figma/file/${key}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data: { document: FigmaNode } = await response.json()

      setState((prev) => ({
        ...prev,
        isLoading: false,
        figmaData: {
          name: data.document.name || "Untitled",
          lastModified: new Date().toISOString(),
          document: data.document,
          components: {},
          styles: {},
        } as FigmaFile,
        selectedNode: nodeId ? findNodeById(data.document, nodeId) : null,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load Figma file"
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
      onError?.(errorMessage)
    }
  }

  const findNodeById = (node: FigmaNode, id: string): FigmaNode | null => {
    if (node.id === id) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id)
        if (found) return found
      }
    }
    return null
  }

  const handleZoom = (direction: "in" | "out" | "reset") => {
    setState((prev) => ({
      ...prev,
      zoom:
        direction === "in" ? Math.min(prev.zoom + 25, 500) : direction === "out" ? Math.max(prev.zoom - 25, 25) : 100,
    }))
  }

  const handleRotate = () => {
    setState((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }))
  }

  const toggleFullscreen = () => {
    setState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }))
  }

  const toggleGrid = () => {
    setState((prev) => ({ ...prev, showGrid: !prev.showGrid }))
  }

  const handleNodeClick = (node: FigmaNode) => {
    setState((prev) => ({ ...prev, selectedNode: node }))
    onNodeSelect?.(node)
  }

  const renderNode = (node: FigmaNode, depth = 0): JSX.Element => {
    const isSelected = state.selectedNode?.id === node.id

    return (
      <div
        key={node.id}
        className={cn(
          "relative border rounded-lg transition-all duration-200 cursor-pointer",
          isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
          depth > 0 && "ml-4 mt-2",
        )}
        onClick={() => handleNodeClick(node)}
        style={{
          transform: `scale(${state.zoom / 100}) rotate(${state.rotation}deg)`,
          transformOrigin: "center",
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-sm">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.type}
              </Badge>
            </div>
            {node.visible !== false && <Eye className="w-4 h-4 text-green-500" />}
          </div>

          <div
            className={cn(
              "w-full h-32 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center",
              state.showGrid && "bg-grid-pattern",
            )}
          >
            <div className="text-center text-gray-500">
              <div className="text-xs font-mono">
                {node.absoluteBoundingBox
                  ? `${Math.round(node.absoluteBoundingBox.width)}×${Math.round(node.absoluteBoundingBox.height)}`
                  : "No bounds"}
              </div>
              <div className="text-xs mt-1">{node.type}</div>
            </div>
          </div>

          {isSelected && (
            <div className="mt-3 p-3 bg-white rounded border">
              <h4 className="font-medium text-sm mb-2">Properties</h4>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-medium">ID:</span> {node.id}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {node.type}
                </div>
                <div>
                  <span className="font-medium">Name:</span> {node.name}
                </div>
                {node.absoluteBoundingBox && (
                  <>
                    <div>
                      <span className="font-medium">Width:</span> {Math.round(node.absoluteBoundingBox.width)}px
                    </div>
                    <div>
                      <span className="font-medium">Height:</span> {Math.round(node.absoluteBoundingBox.height)}px
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="border-t border-gray-100 p-2">
            <div className="text-xs text-gray-500 mb-2">
              {node.children.length} child{node.children.length !== 1 ? "ren" : ""}
            </div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <CardTitle>Loading Figma Preview...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{state.error}</span>
                <Button variant="outline" size="sm" onClick={() => extractedFileKey && loadFigmaFile(extractedFileKey)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!state.figmaData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No Figma file loaded</p>
            <p className="text-sm mt-1">Provide a Figma URL or file key to preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className, state.isFullscreen && "fixed inset-0 z-50 rounded-none")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{state.figmaData.name}</CardTitle>
            <Badge variant="secondary">{state.zoom}%</Badge>
          </div>

          {showControls && (
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => handleZoom("out")} disabled={state.zoom <= 25}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("reset")}>
                {state.zoom}%
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleZoom("in")} disabled={state.zoom >= 500}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleGrid}>
                {state.showGrid ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {state.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              {figmaUrl && (
                <Button variant="outline" size="sm" onClick={() => window.open(figmaUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={previewRef}
          className={cn(
            "relative overflow-auto",
            state.isFullscreen ? "h-[calc(100vh-120px)]" : "h-96",
            state.showGrid && "bg-grid-pattern",
          )}
        >
          <div className="p-4">{state.figmaData.document && renderNode(state.figmaData.document)}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// CLIENT-SAFE utility function
function extractFileKeyFromUrl(url: string): string | null {
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

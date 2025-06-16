"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Search,
  Layers,
  Square,
  Type,
  ImageIcon,
  Circle,
  Triangle,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { FigmaNode } from "@/lib/figma-types"

interface LayerTreeProps {
  figmaData?: FigmaNode
  selectedNodeId?: string
  className?: string
  showSearch?: boolean
  showFilters?: boolean
  onNodeSelect?: (node: FigmaNode) => void
  onNodeToggleVisibility?: (nodeId: string, visible: boolean) => void
  onNodeToggleLock?: (nodeId: string, locked: boolean) => void
}

interface TreeState {
  expandedNodes: Set<string>
  searchQuery: string
  filterType: string
  selectedNode: FigmaNode | null
}

const NODE_TYPE_ICONS = {
  DOCUMENT: Layers,
  CANVAS: Square,
  FRAME: Square,
  GROUP: Layers,
  VECTOR: Triangle,
  BOOLEAN_OPERATION: Circle,
  STAR: Circle,
  LINE: Minus,
  ELLIPSE: Circle,
  POLYGON: Triangle,
  RECTANGLE: Square,
  TEXT: Type,
  SLICE: Square,
  COMPONENT: Square,
  COMPONENT_SET: Layers,
  INSTANCE: Square,
  IMAGE: ImageIcon,
}

const NODE_TYPE_COLORS = {
  DOCUMENT: "text-purple-600",
  CANVAS: "text-blue-600",
  FRAME: "text-green-600",
  GROUP: "text-orange-600",
  VECTOR: "text-red-600",
  TEXT: "text-indigo-600",
  COMPONENT: "text-pink-600",
  INSTANCE: "text-teal-600",
  IMAGE: "text-yellow-600",
}

export function LayerTree({
  figmaData,
  selectedNodeId,
  className,
  showSearch = true,
  showFilters = true,
  onNodeSelect,
  onNodeToggleVisibility,
  onNodeToggleLock,
}: LayerTreeProps) {
  const [state, setState] = useState<TreeState>({
    expandedNodes: new Set(["0:0"]), // Expand root by default
    searchQuery: "",
    filterType: "all",
    selectedNode: null,
  })

  useEffect(() => {
    if (selectedNodeId && figmaData) {
      const node = findNodeById(figmaData, selectedNodeId)
      setState((prev) => ({ ...prev, selectedNode: node }))
    }
  }, [selectedNodeId, figmaData])

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

  const toggleNodeExpansion = (nodeId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedNodes)
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId)
      } else {
        newExpanded.add(nodeId)
      }
      return { ...prev, expandedNodes: newExpanded }
    })
  }

  const handleNodeSelect = (node: FigmaNode) => {
    setState((prev) => ({ ...prev, selectedNode: node }))
    onNodeSelect?.(node)
  }

  const handleSearch = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }

  const handleFilterChange = (filterType: string) => {
    setState((prev) => ({ ...prev, filterType }))
  }

  const shouldShowNode = (node: FigmaNode): boolean => {
    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      if (!node.name.toLowerCase().includes(query)) {
        // Check if any child matches
        if (node.children) {
          const hasMatchingChild = node.children.some((child) => shouldShowNode(child))
          if (!hasMatchingChild) return false
        } else {
          return false
        }
      }
    }

    // Filter by type
    if (state.filterType !== "all" && node.type !== state.filterType.toUpperCase()) {
      return false
    }

    return true
  }

  const getNodeIcon = (nodeType: string) => {
    const IconComponent = NODE_TYPE_ICONS[nodeType as keyof typeof NODE_TYPE_ICONS] || Square
    const colorClass = NODE_TYPE_COLORS[nodeType as keyof typeof NODE_TYPE_COLORS] || "text-gray-600"
    return <IconComponent className={cn("w-4 h-4", colorClass)} />
  }

  const renderNode = (node: FigmaNode, depth = 0): JSX.Element | null => {
    if (!shouldShowNode(node)) return null

    const hasChildren = node.children && node.children.length > 0
    const isExpanded = state.expandedNodes.has(node.id)
    const isSelected = state.selectedNode?.id === node.id
    const isVisible = node.visible !== false
    const isLocked = node.locked === true

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 transition-colors",
            isSelected && "bg-blue-100 hover:bg-blue-200",
            depth > 0 && "ml-4",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleNodeSelect(node)}
        >
          {/* Expand/Collapse Button */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-4 h-4 p-0 hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNodeExpansion(node.id)
                }}
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            ) : null}
          </div>

          {/* Node Icon */}
          <div className="w-4 h-4 flex items-center justify-center">{getNodeIcon(node.type)}</div>

          {/* Node Name */}
          <span
            className={cn(
              "text-sm flex-1 truncate",
              isSelected ? "font-medium text-blue-900" : "text-gray-900",
              !isVisible && "opacity-50",
            )}
          >
            {node.name}
          </span>

          {/* Node Type Badge */}
          <Badge variant="outline" className="text-xs ml-2">
            {node.type}
          </Badge>

          {/* Visibility Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation()
              onNodeToggleVisibility?.(node.id, !isVisible)
            }}
          >
            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
          </Button>

          {/* Lock Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation()
              onNodeToggleLock?.(node.id, !isLocked)
            }}
          >
            {isLocked ? <Lock className="w-3 h-3 text-red-500" /> : <Unlock className="w-3 h-3" />}
          </Button>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">{node.children!.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  if (!figmaData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No Figma data loaded</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5" />
          Layer Tree
        </CardTitle>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="space-y-3">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search layers..."
                  value={state.searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 h-8"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex gap-2">
                <select
                  value={state.filterType}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="frame">Frames</option>
                  <option value="text">Text</option>
                  <option value="vector">Vectors</option>
                  <option value="component">Components</option>
                  <option value="instance">Instances</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      expandedNodes: new Set([figmaData.id]),
                    }))
                  }
                >
                  Collapse All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allNodeIds = new Set<string>()
                    const collectNodeIds = (node: FigmaNode) => {
                      allNodeIds.add(node.id)
                      if (node.children) {
                        node.children.forEach(collectNodeIds)
                      }
                    }
                    collectNodeIds(figmaData)
                    setState((prev) => ({ ...prev, expandedNodes: allNodeIds }))
                  }}
                >
                  Expand All
                </Button>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          <div className="p-3">{renderNode(figmaData)}</div>
        </div>
      </CardContent>

      {/* Selected Node Info */}
      {state.selectedNode && (
        <div className="border-t p-4 bg-gray-50">
          <h4 className="font-medium text-sm mb-2">Selected Layer</h4>
          <div className="space-y-1 text-xs">
            <div>
              <span className="font-medium">Name:</span> {state.selectedNode.name}
            </div>
            <div>
              <span className="font-medium">Type:</span> {state.selectedNode.type}
            </div>
            <div>
              <span className="font-medium">ID:</span> {state.selectedNode.id}
            </div>
            {state.selectedNode.absoluteBoundingBox && (
              <>
                <div>
                  <span className="font-medium">Size:</span> {Math.round(state.selectedNode.absoluteBoundingBox.width)}{" "}
                  × {Math.round(state.selectedNode.absoluteBoundingBox.height)}
                </div>
                <div>
                  <span className="font-medium">Position:</span> {Math.round(state.selectedNode.absoluteBoundingBox.x)},{" "}
                  {Math.round(state.selectedNode.absoluteBoundingBox.y)}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Eye, Code, Layers, Grid, List, Star, StarOff, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FigmaComponent } from "@/lib/figma-types"

interface ComponentLibraryProps {
  figmaFileKey?: string
  className?: string
  onComponentSelect?: (component: FigmaComponent) => void
  onComponentPreview?: (component: FigmaComponent) => void
  onComponentDownload?: (component: FigmaComponent) => void
}

interface LibraryState {
  isLoading: boolean
  error: string | null
  components: FigmaComponent[]
  filteredComponents: FigmaComponent[]
  favorites: Set<string>
  searchQuery: string
  selectedCategory: string
  viewMode: "grid" | "list"
  sortBy: "name" | "date" | "usage"
}

const COMPONENT_CATEGORIES = [
  "All",
  "Buttons",
  "Forms",
  "Navigation",
  "Cards",
  "Modals",
  "Icons",
  "Layout",
  "Data Display",
  "Feedback",
]

export function ComponentLibrary({
  figmaFileKey,
  className,
  onComponentSelect,
  onComponentPreview,
  onComponentDownload,
}: ComponentLibraryProps) {
  const [state, setState] = useState<LibraryState>({
    isLoading: false,
    error: null,
    components: [],
    filteredComponents: [],
    favorites: new Set(),
    searchQuery: "",
    selectedCategory: "All",
    viewMode: "grid",
    sortBy: "name",
  })

  useEffect(() => {
    if (figmaFileKey) {
      loadComponents(figmaFileKey)
    }
  }, [figmaFileKey])

  useEffect(() => {
    filterAndSortComponents()
  }, [state.components, state.searchQuery, state.selectedCategory, state.sortBy])

  const loadComponents = async (fileKey: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      // Use SECURE API endpoint - NO direct Figma API calls from client
      const response = await fetch(`/api/figma/components/${fileKey}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to load components: ${response.status}`)
      }

      const data = await response.json()
      const components = Object.entries(data.meta.components || {}).map(([key, comp]: [string, any]) => ({
        id: key,
        name: comp.name,
        description: comp.description || "",
        category: categorizeComponent(comp.name),
        tags: extractTags(comp.name, comp.description),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: Math.floor(Math.random() * 100), // Mock data
        thumbnail: `https://via.placeholder.com/200x150?text=${encodeURIComponent(comp.name)}`,
        figmaNodeId: comp.node_id,
        componentSetId: comp.component_set_id,
        documentationLinks: comp.documentation_links || [],
      }))

      setState((prev) => ({
        ...prev,
        isLoading: false,
        components,
        filteredComponents: components,
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load components"
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
    }
  }

  const filterAndSortComponents = () => {
    let filtered = [...state.components]

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (comp) =>
          comp.name.toLowerCase().includes(query) ||
          comp.description.toLowerCase().includes(query) ||
          comp.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (state.selectedCategory !== "All") {
      filtered = filtered.filter((comp) => comp.category === state.selectedCategory)
    }

    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "usage":
          return b.usageCount - a.usageCount
        default:
          return 0
      }
    })

    setState((prev) => ({ ...prev, filteredComponents: filtered }))
  }

  const toggleFavorite = (componentId: string) => {
    setState((prev) => {
      const newFavorites = new Set(prev.favorites)
      if (newFavorites.has(componentId)) {
        newFavorites.delete(componentId)
      } else {
        newFavorites.add(componentId)
      }
      return { ...prev, favorites: newFavorites }
    })
  }

  const handleSearch = (query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }

  const handleCategoryChange = (category: string) => {
    setState((prev) => ({ ...prev, selectedCategory: category }))
  }

  const handleSortChange = (sortBy: "name" | "date" | "usage") => {
    setState((prev) => ({ ...prev, sortBy }))
  }

  const handleViewModeChange = (viewMode: "grid" | "list") => {
    setState((prev) => ({ ...prev, viewMode }))
  }

  const ComponentCard = ({ component }: { component: FigmaComponent }) => {
    const isFavorite = state.favorites.has(component.id)

    return (
      <Card className="group hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="relative h-32 bg-gray-100 rounded-t-lg overflow-hidden">
            <img
              src={component.thumbnail || "/placeholder.svg"}
              alt={component.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onComponentPreview?.(component)}>
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => onComponentSelect?.(component)}>
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100"
              onClick={() => toggleFavorite(component.id)}
            >
              {isFavorite ? <Star className="w-4 h-4 text-yellow-500 fill-current" /> : <StarOff className="w-4 h-4" />}
            </Button>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm truncate flex-1">{component.name}</h3>
              <Badge variant="outline" className="ml-2 text-xs">
                {component.category}
              </Badge>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {component.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {component.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {component.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{component.tags.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{component.usageCount} uses</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(component.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ComponentListItem = ({ component }: { component: FigmaComponent }) => {
    const isFavorite = state.favorites.has(component.id)

    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={component.thumbnail || "/placeholder.svg"}
                alt={component.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{component.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {component.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 truncate mb-2">
                {component.description || "No description available"}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{component.usageCount} uses</span>
                <span>{new Date(component.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => toggleFavorite(component.id)}>
                {isFavorite ? (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onComponentPreview?.(component)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => onComponentSelect?.(component)}>
                <Code className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (state.isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Component Library...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="h-32 w-full rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Component Library
            <Badge variant="secondary">{state.filteredComponents.length} components</Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant={state.viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={state.viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search components..."
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={state.sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="usage">Sort by Usage</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMPONENT_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={state.selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {state.filteredComponents.length === 0 ? (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">
              {state.searchQuery || state.selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "No components available in this file"}
            </p>
          </div>
        ) : (
          <div
            className={cn(
              state.viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3",
            )}
          >
            {state.filteredComponents.map((component) =>
              state.viewMode === "grid" ? (
                <ComponentCard key={component.id} component={component} />
              ) : (
                <ComponentListItem key={component.id} component={component} />
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// CLIENT-SAFE utility functions
function categorizeComponent(name: string): string {
  const lowerName = name.toLowerCase()

  if (lowerName.includes("button") || lowerName.includes("btn")) return "Buttons"
  if (lowerName.includes("input") || lowerName.includes("form") || lowerName.includes("field")) return "Forms"
  if (lowerName.includes("nav") || lowerName.includes("menu") || lowerName.includes("breadcrumb")) return "Navigation"
  if (lowerName.includes("card") || lowerName.includes("panel")) return "Cards"
  if (lowerName.includes("modal") || lowerName.includes("dialog") || lowerName.includes("popup")) return "Modals"
  if (lowerName.includes("icon")) return "Icons"
  if (lowerName.includes("layout") || lowerName.includes("grid") || lowerName.includes("container")) return "Layout"
  if (lowerName.includes("table") || lowerName.includes("list") || lowerName.includes("chart")) return "Data Display"
  if (lowerName.includes("alert") || lowerName.includes("toast") || lowerName.includes("notification"))
    return "Feedback"

  return "Layout"
}

function extractTags(name: string, description: string): string[] {
  const text = `${name} ${description}`.toLowerCase()
  const tags: string[] = []

  const patterns = [
    "primary",
    "secondary",
    "small",
    "large",
    "dark",
    "light",
    "responsive",
    "mobile",
    "desktop",
    "interactive",
    "animated",
  ]

  patterns.forEach((pattern) => {
    if (text.includes(pattern)) {
      tags.push(pattern)
    }
  })

  return [...new Set(tags)]
}

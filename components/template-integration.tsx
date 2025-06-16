"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWizardState } from "@/hooks/use-wizard-state"
import { componentTemplates } from "@/lib/component-templates"
import { Search, Sparkles, Eye, Check } from "lucide-react"

export function TemplateIntegration() {
  const { wizardData, updateWizardData } = useWizardState()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Összes", count: componentTemplates.length },
    { id: "layout", name: "Layout", count: componentTemplates.filter((t) => t.category === "layout").length },
    { id: "form", name: "Űrlapok", count: componentTemplates.filter((t) => t.category === "form").length },
    {
      id: "navigation",
      name: "Navigáció",
      count: componentTemplates.filter((t) => t.category === "navigation").length,
    },
    { id: "content", name: "Tartalom", count: componentTemplates.filter((t) => t.category === "content").length },
  ]

  const filteredTemplates = componentTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectTemplate = (templateId: string) => {
    updateWizardData({ selectedTemplate: templateId })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Template Kiválasztása</h2>
        <p className="text-gray-600">Válasszon egy template-et, amely a legjobban illeszkedik a Figma tervéhez</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Keresés és Szűrés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Template keresése..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              wizardData.selectedTemplate === template.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onClick={() => selectTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                {wizardData.selectedTemplate === template.id && <Check className="h-4 w-4 text-blue-600" />}
              </div>

              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Template Előnézet</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">{template.description}</p>

                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Komplexitás: {template.complexity}</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    {template.aiOptimized ? "AI Optimalizált" : "Standard"}
                  </span>
                </div>
              </div>

              <Button
                variant={wizardData.selectedTemplate === template.id ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  selectTemplate(template.id)
                }}
              >
                {wizardData.selectedTemplate === template.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Kiválasztva
                  </>
                ) : (
                  "Kiválasztás"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincs találat</h3>
            <p className="text-gray-600">Próbáljon meg más keresési kifejezést vagy szűrőt.</p>
          </CardContent>
        </Card>
      )}

      {/* Selected Template Info */}
      {wizardData.selectedTemplate && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Check className="h-5 w-5" />
              Kiválasztott Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selected = componentTemplates.find((t) => t.id === wizardData.selectedTemplate)
              return selected ? (
                <div className="space-y-2">
                  <h3 className="font-medium text-green-800">{selected.name}</h3>
                  <p className="text-sm text-green-700">{selected.description}</p>
                  <div className="flex gap-2">
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

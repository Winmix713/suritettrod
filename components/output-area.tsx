"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useWizardState } from "@/hooks/use-wizard-state"
import { JSXPreview } from "@/components/jsx-preview"
import { Copy, Download, Eye, Code, Palette, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function OutputArea() {
  const { wizardData } = useWizardState()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("preview")

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Másolva!",
        description: `${type} sikeresen a vágólapra másolva.`,
      })
    } catch (err) {
      toast({
        title: "Hiba",
        description: "Nem sikerült másolni a tartalmat.",
        variant: "destructive",
      })
    }
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Letöltve!",
      description: `${filename} sikeresen letöltve.`,
    })
  }

  if (!wizardData.generatedCode) {
    return (
      <div className="text-center py-12">
        <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Még nincs generált kód</h3>
        <p className="text-gray-600">Kérjük, fejezze be az AI konverziót az előző lépésben.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Generált Kód</h2>
          <p className="text-gray-600">AI által létrehozott React komponens</p>
        </div>

        <div className="flex items-center gap-4">
          {wizardData.aiAnalysis && (
            <>
              <Badge variant="outline">Komplexitás: {wizardData.aiAnalysis.estimatedComplexity}</Badge>
              <Badge variant="outline">Minőség: {wizardData.aiAnalysis.qualityScore}/100</Badge>
            </>
          )}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Előnézet
          </TabsTrigger>
          <TabsTrigger value="jsx" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            JSX Kód
          </TabsTrigger>
          <TabsTrigger value="css" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            CSS Stílusok
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Elemzés
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Komponens Előnézet
                </span>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Teljes képernyő
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 bg-gray-50">
                <JSXPreview code={wizardData.generatedCode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSX Code Tab */}
        <TabsContent value="jsx" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  React JSX Kód
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wizardData.generatedCode, "JSX kód")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Másolás
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(wizardData.generatedCode, "Component.tsx", "JSX")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Letöltés
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{wizardData.generatedCode}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSS Tab */}
        <TabsContent value="css" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  CSS Stílusok
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wizardData.generatedCSS || "", "CSS kód")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Másolás
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(wizardData.generatedCSS || "", "Component.css", "CSS")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Letöltés
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{wizardData.generatedCSS || "/* Nincs CSS kód generálva */"}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          {wizardData.aiAnalysis ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Elemzés Részletei</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Konverziós Stratégia</h4>
                      <p className="text-sm text-gray-600">{wizardData.aiAnalysis.conversionStrategy}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Ajánlott Megközelítés</h4>
                      <p className="text-sm text-gray-600">{wizardData.aiAnalysis.recommendedApproach}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimalizálási Javaslatok</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {wizardData.aiAnalysis.optimizationSuggestions?.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {wizardData.aiAnalysis.potentialIssues?.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Potenciális Problémák</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {wizardData.aiAnalysis.potentialIssues.map((issue: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-yellow-700">
                          <div className="h-2 w-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nincs elérhető elemzési adat</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

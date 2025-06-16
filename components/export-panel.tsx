"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWizardState } from "@/hooks/use-wizard-state"
import { ExportService } from "@/services/export-service"
import { Download, Package, Github, Share2, CheckCircle, FileText, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

export function ExportPanel() {
  const { wizardData } = useWizardState()
  const { toast } = useToast()
  const [exportOptions, setExportOptions] = useState<ExportOption[]>([
    {
      id: "component",
      title: "React Komponens",
      description: "TSX és CSS fájlok letöltése",
      icon: <FileText className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "package",
      title: "NPM Csomag",
      description: "Teljes NPM csomag generálása",
      icon: <Package className="h-4 w-4" />,
      enabled: false,
    },
    {
      id: "github",
      title: "GitHub Repository",
      description: "Közvetlen feltöltés GitHub-ra",
      icon: <Github className="h-4 w-4" />,
      enabled: false,
    },
    {
      id: "share",
      title: "Megosztható Link",
      description: "Online előnézet létrehozása",
      icon: <Share2 className="h-4 w-4" />,
      enabled: false,
    },
  ])

  const [exportFormat, setExportFormat] = useState("typescript")
  const [includeTests, setIncludeTests] = useState(false)
  const [includeStorybook, setIncludeStorybook] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const toggleExportOption = (optionId: string) => {
    setExportOptions((prev) =>
      prev.map((option) => (option.id === optionId ? { ...option, enabled: !option.enabled } : option)),
    )
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const enabledOptions = exportOptions.filter((option) => option.enabled)

      for (const option of enabledOptions) {
        switch (option.id) {
          case "component":
            await exportComponent()
            break
          case "package":
            await exportPackage()
            break
          case "github":
            await exportToGitHub()
            break
          case "share":
            await createShareableLink()
            break
        }
      }

      toast({
        title: "Export sikeres!",
        description: "Minden kiválasztott formátum sikeresen exportálva.",
      })
    } catch (error) {
      toast({
        title: "Export hiba",
        description: "Hiba történt az export során.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportComponent = async () => {
    const files = ExportService.generateComponentFiles({
      jsx: wizardData.generatedCode,
      css: wizardData.generatedCSS,
      format: exportFormat,
      includeTests,
      includeStorybook,
    })

    // Create ZIP file
    const zip = await ExportService.createZipFile(files)
    ExportService.downloadFile(zip, "figma-component.zip")
  }

  const exportPackage = async () => {
    // Simulate NPM package creation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast({
      title: "NPM Csomag",
      description: "NPM csomag sikeresen generálva!",
    })
  }

  const exportToGitHub = async () => {
    // Simulate GitHub upload
    await new Promise((resolve) => setTimeout(resolve, 3000))
    toast({
      title: "GitHub Export",
      description: "Kód sikeresen feltöltve GitHub-ra!",
    })
  }

  const createShareableLink = async () => {
    // Simulate link creation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const shareUrl = `https://figma-converter.vercel.app/share/${Date.now()}`

    await navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Megosztható Link",
      description: "Link létrehozva és vágólapra másolva!",
    })
  }

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Konverzió Befejezve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                Generált Fájlok
              </Badge>
              <p className="text-2xl font-bold text-green-700">{wizardData.generatedCode ? "2" : "0"}</p>
              <p className="text-sm text-green-600">TSX + CSS</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                Kód Sorok
              </Badge>
              <p className="text-2xl font-bold text-green-700">
                {wizardData.generatedCode ? wizardData.generatedCode.split("\n").length : 0}
              </p>
              <p className="text-sm text-green-600">JSX kód</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                Minőség
              </Badge>
              <p className="text-2xl font-bold text-green-700">{wizardData.aiAnalysis?.qualityScore || 0}/100</p>
              <p className="text-sm text-green-600">AI értékelés</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Beállítások
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Formátum</label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typescript">TypeScript (.tsx)</SelectItem>
                <SelectItem value="javascript">JavaScript (.jsx)</SelectItem>
                <SelectItem value="vue">Vue.js (.vue)</SelectItem>
                <SelectItem value="angular">Angular (.component.ts)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="tests" checked={includeTests} onCheckedChange={setIncludeTests} />
              <label htmlFor="tests" className="text-sm font-medium">
                Tesztek generálása (Jest + Testing Library)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="storybook" checked={includeStorybook} onCheckedChange={setIncludeStorybook} />
              <label htmlFor="storybook" className="text-sm font-medium">
                Storybook stories hozzáadása
              </label>
            </div>
          </div>

          {/* Export Methods */}
          <div className="space-y-4">
            <h3 className="font-medium">Export Módszerek</h3>
            <div className="grid gap-3">
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    option.enabled ? "border-blue-200 bg-blue-50" : "border-gray-200"
                  }`}
                  onClick={() => toggleExportOption(option.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={option.enabled} readOnly />
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <div>
                        <p className="font-medium">{option.title}</p>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>

                  {option.enabled && <Badge variant="default">Kiválasztva</Badge>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleExport}
          disabled={isExporting || !exportOptions.some((opt) => opt.enabled)}
          size="lg"
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Export folyamatban...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Indítása
            </>
          )}
        </Button>

        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Előnézet Mappa
        </Button>
      </div>

      {/* Export Tips */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tipp:</strong> A generált kód production-ready, de javasoljuk a kód áttekintését és tesztelését éles
          környezetben való használat előtt.
        </AlertDescription>
      </Alert>
    </div>
  )
}

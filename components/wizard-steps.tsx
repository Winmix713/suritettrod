"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFigmaConnection } from "@/hooks/use-figma-connection"
import { useWizardState } from "@/hooks/use-wizard-state"
import { FigmaService } from "@/services/figma-service"
import { Link, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

function Step1() {
  const { isConnected, connectionStatus } = useFigmaConnection()
  const { wizardData, updateWizardData } = useWizardState()
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")

  const handleUrlChange = async (url: string) => {
    updateWizardData({ figmaUrl: url })
    setValidationError("")

    if (url) {
      const fileId = FigmaService.extractFileId(url)
      if (fileId) {
        updateWizardData({ figmaFileId: fileId })

        if (isConnected) {
          setIsValidating(true)
          try {
            // Validate Figma file access
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
            setValidationError("")
          } catch (error) {
            setValidationError("Nem sikerült elérni a Figma fájlt. Ellenőrizze a jogosultságokat.")
          } finally {
            setIsValidating(false)
          }
        }
      } else {
        setValidationError("Érvénytelen Figma URL formátum")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className={`border-2 ${isConnected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            Figma Kapcsolat Állapota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isConnected ? "text-green-700" : "text-red-700"}`}>
                {isConnected ? "Kapcsolódva" : "Nincs kapcsolat"}
              </p>
              <p className="text-sm text-gray-600">{connectionStatus}</p>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Aktív" : "Inaktív"}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Figma URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Figma Fájl URL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="figma-url">Figma fájl linkje</Label>
            <Input
              id="figma-url"
              type="url"
              placeholder="https://www.figma.com/file/..."
              value={wizardData.figmaUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              disabled={!isConnected}
            />
          </div>

          {isValidating && (
            <div className="flex items-center gap-2 text-blue-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Figma fájl validálása...</span>
            </div>
          )}

          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {wizardData.figmaFileId && !validationError && !isValidating && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Figma fájl sikeresen azonosítva: {wizardData.figmaFileId}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Támogatott URL formátumok:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>https://www.figma.com/file/[file-id]/[file-name]</li>
              <li>https://www.figma.com/design/[file-id]/[file-name]</li>
              <li>https://www.figma.com/proto/[file-id]/[file-name]</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Tippek</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2">
            <li>• Győződjön meg róla, hogy a Figma fájl publikus vagy megosztott Önnel</li>
            <li>• A fájl URL-jét a böngésző címsorából másolhatja</li>
            <li>• Ellenőrizze a Figma API token érvényességét</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export const WizardSteps = {
  Step1,
}

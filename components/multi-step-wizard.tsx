"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { WizardStepper } from "@/components/wizard-stepper"
import { WizardSteps } from "@/components/wizard-steps"
import { ConversionAI } from "@/components/conversion-ai"
import { OutputArea } from "@/components/output-area"
import { ExportPanel } from "@/components/export-panel"
import { TemplateIntegration } from "@/components/template-integration"
import { useWizardState } from "@/hooks/use-wizard-state"
import { useFigmaConnection } from "@/hooks/use-figma-connection"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"

const STEPS = [
  { id: 1, title: "Figma Kapcsolat", description: "Figma fájl betöltése" },
  { id: 2, title: "Template Választás", description: "Komponens template kiválasztása" },
  { id: 3, title: "AI Konverzió", description: "Intelligens kód generálás" },
  { id: 4, title: "Kód Előnézet", description: "Generált kód megtekintése" },
  { id: 5, title: "Export", description: "Kód letöltése és megosztása" },
]

export function MultiStepWizard() {
  const { currentStep, setCurrentStep, wizardData, updateWizardData } = useWizardState()
  const { isConnected } = useFigmaConnection()
  const [isProcessing, setIsProcessing] = useState(false)

  const progress = (currentStep / STEPS.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isConnected && wizardData.figmaUrl
      case 2:
        return wizardData.selectedTemplate
      case 3:
        return wizardData.generatedCode
      case 4:
        return wizardData.generatedCode
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length && canProceed()) {
      if (currentStep === 3) {
        setIsProcessing(true)
        // AI processing simulation
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsProcessing(false)
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <WizardSteps.Step1 />
      case 2:
        return <TemplateIntegration />
      case 3:
        return <ConversionAI />
      case 4:
        return <OutputArea />
      case 5:
        return <ExportPanel />
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Konverziós Varázsló</CardTitle>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {currentStep}/{STEPS.length}
            </Badge>
          </div>

          <div className="space-y-4">
            <Progress value={progress} className="h-3" />
            <WizardStepper steps={STEPS} currentStep={currentStep} />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            {STEPS[currentStep - 1]?.title}
          </CardTitle>
          <p className="text-gray-600">{STEPS[currentStep - 1]?.description}</p>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium">AI feldolgozás folyamatban...</p>
              <p className="text-gray-600">Ez néhány másodpercet vehet igénybe</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Előző
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {currentStep} / {STEPS.length} lépés
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || currentStep === STEPS.length}
          className="flex items-center gap-2"
        >
          Következő
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

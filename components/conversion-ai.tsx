"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWizardState } from "@/hooks/use-wizard-state"
import { AIConversionService } from "@/services/ai-conversion-service"
import { Brain, Zap, Palette, CheckCircle, AlertTriangle } from "lucide-react"

interface ConversionStep {
  id: string
  title: string
  description: string
  status: "pending" | "processing" | "completed" | "error"
  progress: number
}

export function ConversionAI() {
  const { wizardData, updateWizardData } = useWizardState()
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([
    {
      id: "analysis",
      title: "Figma Struktúra Elemzése",
      description: "AI elemzi a Figma komponenseket és layoutot",
      status: "pending",
      progress: 0,
    },
    {
      id: "optimization",
      title: "Kód Optimalizálás",
      description: "React komponens struktúra tervezése",
      status: "pending",
      progress: 0,
    },
    {
      id: "generation",
      title: "Kód Generálás",
      description: "JSX és CSS kód automatikus létrehozása",
      status: "pending",
      progress: 0,
    },
    {
      id: "validation",
      title: "Kód Validálás",
      description: "Generált kód minőségének ellenőrzése",
      status: "pending",
      progress: 0,
    },
  ])

  const [isConverting, setIsConverting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  const startConversion = async () => {
    setIsConverting(true)

    try {
      // Step 1: Analysis
      updateStepStatus("analysis", "processing")
      await simulateProgress("analysis", 3000)

      const analysis = await AIConversionService.analyzeFigmaStructure({
        url: wizardData.figmaUrl,
        fileId: wizardData.figmaFileId,
      })

      setAiAnalysis(analysis)
      updateStepStatus("analysis", "completed")

      // Step 2: Optimization
      updateStepStatus("optimization", "processing")
      await simulateProgress("optimization", 2000)
      updateStepStatus("optimization", "completed")

      // Step 3: Generation
      updateStepStatus("generation", "processing")
      await simulateProgress("generation", 4000)

      const mockCode = generateMockCode(analysis)
      updateWizardData({
        generatedCode: mockCode.jsx,
        generatedCSS: mockCode.css,
        aiAnalysis: analysis,
      })

      updateStepStatus("generation", "completed")

      // Step 4: Validation
      updateStepStatus("validation", "processing")
      await simulateProgress("validation", 1500)
      updateStepStatus("validation", "completed")
    } catch (error) {
      console.error("Conversion failed:", error)
      // Mark current step as error
      const currentStep = conversionSteps.find((step) => step.status === "processing")
      if (currentStep) {
        updateStepStatus(currentStep.id, "error")
      }
    } finally {
      setIsConverting(false)
    }
  }

  const updateStepStatus = (stepId: string, status: ConversionStep["status"]) => {
    setConversionSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, status, progress: status === "completed" ? 100 : step.progress } : step,
      ),
    )
  }

  const simulateProgress = (stepId: string, duration: number) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setConversionSteps((prev) =>
          prev.map((step) => {
            if (step.id === stepId && step.status === "processing") {
              const newProgress = Math.min(step.progress + Math.random() * 15, 95)
              return { ...step, progress: newProgress }
            }
            return step
          }),
        )
      }, 200)

      setTimeout(() => {
        clearInterval(interval)
        resolve()
      }, duration)
    })
  }

  const generateMockCode = (analysis: any) => {
    return {
      jsx: `import React from 'react'
import './Component.css'

interface ComponentProps {
  className?: string
}

export default function GeneratedComponent({ className }: ComponentProps) {
  return (
    <div className={\`generated-component \${className || ''}\`}>
      <div className="header">
        <h1 className="title">Figma Design</h1>
        <p className="subtitle">Converted with AI</p>
      </div>
      
      <div className="content">
        <div className="card">
          <h2>Feature 1</h2>
          <p>AI-generated content based on your Figma design</p>
        </div>
        
        <div className="card">
          <h2>Feature 2</h2>
          <p>Responsive and accessible components</p>
        </div>
      </div>
      
      <div className="actions">
        <button className="primary-button">Get Started</button>
        <button className="secondary-button">Learn More</button>
      </div>
    </div>
  )
}`,
      css: `.generated-component {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #718096;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.card p {
  color: #4a5568;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background: #2c5aa0;
}

.secondary-button {
  background: transparent;
  color: #3182ce;
  border: 2px solid #3182ce;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background: #3182ce;
  color: white;
}`,
    }
  }

  const getStepIcon = (step: ConversionStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "processing":
        return <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const overallProgress = conversionSteps.reduce((acc, step) => acc + step.progress, 0) / conversionSteps.length

  return (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      {aiAnalysis && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Brain className="h-5 w-5" />
              AI Elemzés Eredménye
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Komplexitás
                </Badge>
                <p className="text-2xl font-bold text-green-700 capitalize">{aiAnalysis.estimatedComplexity}</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Minőségi Pontszám
                </Badge>
                <p className="text-2xl font-bold text-green-700">{aiAnalysis.qualityScore}/100</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Stratégia
                </Badge>
                <p className="text-sm text-green-700">{aiAnalysis.conversionStrategy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI Konverzió Folyamata
          </CardTitle>
          <div className="space-y-2">
            <Progress value={overallProgress} className="h-2" />
            <p className="text-sm text-gray-600">Összesített előrehaladás: {Math.round(overallProgress)}%</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {conversionSteps.map((step) => (
            <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border">
              {getStepIcon(step)}

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{step.title}</h3>
                  <Badge
                    variant={
                      step.status === "completed"
                        ? "default"
                        : step.status === "error"
                          ? "destructive"
                          : step.status === "processing"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {step.status === "pending" && "Várakozik"}
                    {step.status === "processing" && "Feldolgozás"}
                    {step.status === "completed" && "Kész"}
                    {step.status === "error" && "Hiba"}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-2">{step.description}</p>

                {step.status === "processing" && <Progress value={step.progress} className="h-1" />}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center">
        {!isConverting && !wizardData.generatedCode && (
          <Button
            onClick={startConversion}
            size="lg"
            className="flex items-center gap-2"
            disabled={!wizardData.figmaUrl}
          >
            <Brain className="h-5 w-5" />
            AI Konverzió Indítása
          </Button>
        )}

        {isConverting && (
          <Button disabled size="lg" className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Konverzió folyamatban...
          </Button>
        )}

        {wizardData.generatedCode && !isConverting && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>✅ AI konverzió sikeresen befejezve! Folytassa a következő lépéssel.</AlertDescription>
          </Alert>
        )}
      </div>

      {/* AI Recommendations */}
      {aiAnalysis?.optimizationSuggestions && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Palette className="h-5 w-5" />
              AI Javaslatok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiAnalysis.optimizationSuggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-blue-700">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

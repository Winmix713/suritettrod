"use client"

import { useState, useEffect } from "react"
import { FigmaConnectionProvider } from "@/components/figma-connection-provider"
import { MultiStepWizard } from "@/components/multi-step-wizard"
import { FigmaStatusToast } from "@/components/figma-status-toast"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OnboardingTour } from "@/components/advanced-ux/onboarding-tour"
import { SmartNotifications } from "@/components/advanced-ux/smart-notifications"
import { ErrorBoundary } from "@/components/enhanced-error-boundary"
import { initializeFigmaToken } from "@/lib/figma-config"
import { Toaster } from "@/components/ui/toaster"

export default function FigmaConverterApp() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Figma connection
        await initializeFigmaToken()

        // Check if first time user
        const hasSeenOnboarding = localStorage.getItem("figma-converter-onboarding")
        if (!hasSeenOnboarding) {
          setShowOnboarding(true)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Initialization failed:", error)
        setIsInitialized(true) // Still show the app
      }
    }

    initialize()
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("figma-converter-onboarding", "completed")
    setShowOnboarding(false)
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Figma Converter inicializálása...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <FigmaConnectionProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {/* Performance Monitor */}
          <PerformanceMonitor />

          {/* Smart Notifications */}
          <SmartNotifications />

          {/* Main Application */}
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎨 Figma → React Converter
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professzionális Figma tervek konvertálása React komponensekké AI segítségével
              </p>
            </div>

            {/* Multi-Step Wizard */}
            <MultiStepWizard />
          </div>

          {/* Figma Connection Status */}
          <FigmaStatusToast />

          {/* Onboarding Tour */}
          {showOnboarding && <OnboardingTour onComplete={handleOnboardingComplete} />}

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </FigmaConnectionProvider>
    </ErrorBoundary>
  )
}

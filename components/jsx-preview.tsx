"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface JSXPreviewProps {
  code: string
}

export function JSXPreview({ code }: JSXPreviewProps) {
  const [previewError, setPreviewError] = useState<string | null>(null)

  // Mock preview component - in real implementation, this would use a safe JSX renderer
  const MockPreview = () => {
    return (
      <div className="generated-component max-w-2xl mx-auto p-6 font-sans">
        <div className="header text-center mb-8">
          <h1 className="title text-3xl font-bold text-gray-900 mb-2">Figma Design</h1>
          <p className="subtitle text-lg text-gray-600">Converted with AI</p>
        </div>

        <div className="content grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Feature 1</h2>
            <p className="text-gray-600">AI-generated content based on your Figma design</p>
          </div>

          <div className="card bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Feature 2</h2>
            <p className="text-gray-600">Responsive and accessible components</p>
          </div>
        </div>

        <div className="actions flex gap-4 justify-center">
          <button className="primary-button bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </button>
          <button className="secondary-button border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    )
  }

  useEffect(() => {
    // Validate JSX code for potential issues
    try {
      if (code.includes("<script>") || code.includes("javascript:")) {
        setPreviewError("Biztonsági okokból nem jeleníthető meg a kód")
      } else {
        setPreviewError(null)
      }
    } catch (error) {
      setPreviewError("Hiba a kód elemzése során")
    }
  }, [code])

  if (previewError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{previewError}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="jsx-preview">
      <MockPreview />
    </div>
  )
}

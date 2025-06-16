"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Code, Download, Github, Zap, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export function FigmaConverter() {
  const [figmaUrl, setFigmaUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [step, setStep] = useState(1)

  const handleConvert = async () => {
    if (!figmaUrl) return

    setIsLoading(true)
    setStep(2)

    // Simulate conversion process
    setTimeout(() => {
      setGeneratedCode(`import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function GeneratedComponent() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          This is your converted Figma design!
        </p>
        <Button className="w-full">
          Get Started
        </Button>
      </CardContent>
    </Card>
  )
}`)
      setStep(3)
      setIsLoading(false)
    }, 3000)
  }

  const handleExport = () => {
    // Create and download file
    const blob = new Blob([generatedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-component.tsx"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 3 && <div className={`w-16 h-1 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">📥 Input</TabsTrigger>
          <TabsTrigger value="preview">👀 Preview</TabsTrigger>
          <TabsTrigger value="export">📤 Export</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Figma Design Input</span>
              </CardTitle>
              <CardDescription>Enter your Figma file URL to start the conversion process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figma-url">Figma File URL</Label>
                <Input
                  id="figma-url"
                  placeholder="https://www.figma.com/file/..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your Figma file is publicly accessible or you have the proper permissions.
                </AlertDescription>
              </Alert>

              <Button onClick={handleConvert} disabled={!figmaUrl || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Convert to React
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Service Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Figma API</span>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Groq AI</span>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">GitHub</span>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Generated React Code</span>
              </CardTitle>
              <CardDescription>Preview and customize your generated React component</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <div className="space-y-4">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{generatedCode}</code>
                    </pre>
                  </div>

                  {/* Live Preview */}
                  <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg bg-white">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                      <div className="max-w-md mx-auto">
                        <Card>
                          <CardHeader>
                            <CardTitle>Welcome</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-4">This is your converted Figma design!</p>
                            <Button className="w-full">Get Started</Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No code generated yet. Start by converting a Figma design.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export Options</span>
              </CardTitle>
              <CardDescription>Download your code or push to GitHub repository</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedCode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleExport} className="h-20 flex-col">
                    <Download className="w-6 h-6 mb-2" />
                    <span>Download Code</span>
                    <span className="text-xs opacity-75">Save as .tsx file</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex-col">
                    <Github className="w-6 h-6 mb-2" />
                    <span>Push to GitHub</span>
                    <span className="text-xs opacity-75">Create new repository</span>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Download className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate code first to enable export options.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

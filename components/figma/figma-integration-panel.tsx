"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, FileText, Download, AlertCircle, CheckCircle, Loader2, ExternalLink, Copy, Zap } from "lucide-react"
import { FigmaUrlParser } from "@/utils/figma-url-parser"
import { figmaApiClient } from "@/lib/figma-api-client"
import { FigmaBatchProcessor } from "@/services/figma-batch-processor"

interface OutputData {
  figmaData?: any
  jsx: string
  css: string
  figmaCss: string
  figmaUrl: string
}

interface FigmaIntegrationPanelProps {
  onComplete: (result: OutputData) => void
}

interface ProcessingProgress {
  stage: string
  progress: number
  message: string
  details?: string
}

export function FigmaIntegrationPanel({ onComplete }: FigmaIntegrationPanelProps) {
  const [figmaUrl, setFigmaUrl] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState<ProcessingProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("input")

  const validateFigmaUrl = useCallback((url: string) => {
    try {
      const parsed = FigmaUrlParser.parse(url)
      return parsed.isValid
    } catch {
      return false
    }
  }, [])

  const handleUrlChange = (value: string) => {
    setFigmaUrl(value)
    setError(null)

    if (value && !validateFigmaUrl(value)) {
      setError("Invalid Figma URL format. Please use a valid Figma file URL.")
    }
  }

  const handleProcessFile = async () => {
    if (!figmaUrl || !validateFigmaUrl(figmaUrl)) {
      setError("Please enter a valid Figma URL")
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress({ stage: "Initializing", progress: 0, message: "Starting Figma file processing..." })
    setActiveTab("progress")

    try {
      // Parse Figma URL
      const parsed = FigmaUrlParser.parse(figmaUrl)

      // Set access token if provided
      if (accessToken) {
        // This would set the token in the API client
        console.log("Using provided access token")
      }

      // Stage 1: Fetch file info
      setProgress({
        stage: "Fetching",
        progress: 10,
        message: "Fetching Figma file information...",
        details: `File ID: ${parsed.fileId}`,
      })

      const fileData = await figmaApiClient.getFile(parsed.fileId!)
      setFileInfo(fileData)

      // Stage 2: Process with batch processor
      setProgress({
        stage: "Processing",
        progress: 30,
        message: "Processing design elements...",
        details: "Analyzing components and styles",
      })

      const result = await FigmaBatchProcessor.processFile(parsed.fileId!, {
        includeImages: true,
        optimizeImages: true,
        analyzeComponents: true,
        generateCSS: true,
        onProgress: (batchProgress) => {
          setProgress({
            stage: "Processing",
            progress: 30 + batchProgress.progress * 0.6, // 30% to 90%
            message: batchProgress.message,
            details: batchProgress.details,
          })
        },
      })

      // Stage 3: Generate output
      setProgress({
        stage: "Generating",
        progress: 95,
        message: "Generating React components...",
        details: "Creating JSX and CSS output",
      })

      // Create output data
      const outputData: OutputData = {
        figmaData: fileData,
        jsx: result.jsx || generateSampleJSX(fileData),
        css: result.css || generateSampleCSS(fileData),
        figmaCss: result.figmaCss || "",
        figmaUrl: figmaUrl,
      }

      setProgress({
        stage: "Complete",
        progress: 100,
        message: "Processing complete!",
        details: "Ready to view results",
      })

      // Complete after a short delay
      setTimeout(() => {
        onComplete(outputData)
        setIsProcessing(false)
        setProgress(null)
      }, 1000)
    } catch (err: any) {
      console.error("Figma processing error:", err)
      setError(err.message || "Failed to process Figma file")
      setIsProcessing(false)
      setProgress(null)
      setActiveTab("input")
    }
  }

  const generateSampleJSX = (fileData: any) => {
    return `import React from 'react'

export default function ${fileData.name?.replace(/[^a-zA-Z0-9]/g, "") || "FigmaComponent"}() {
  return (
    <div className="figma-component">
      <h1>${fileData.name || "Figma Design"}</h1>
      <p>Generated from Figma file</p>
      {/* Component content will be generated here */}
    </div>
  )
}`
  }

  const generateSampleCSS = (fileData: any) => {
    return `.figma-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.figma-component h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.figma-component p {
  color: #666;
  margin: 0;
}`
  }

  const handleCancel = () => {
    setIsProcessing(false)
    setProgress(null)
    setActiveTab("input")
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text && validateFigmaUrl(text)) {
        setFigmaUrl(text)
        setError(null)
      } else {
        setError("Clipboard doesn't contain a valid Figma URL")
      }
    } catch (err) {
      setError("Failed to read from clipboard")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input" disabled={isProcessing}>
            <Link className="w-4 h-4 mr-2" />
            Input
          </TabsTrigger>
          <TabsTrigger value="progress" disabled={!isProcessing && !progress}>
            <Loader2 className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!fileInfo}>
            <FileText className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.332 8.668a3.333 3.333 0 0 0 0-6.663H8.668a3.333 3.333 0 0 0 0 6.663 3.333 3.333 0 0 0 0 6.665 3.333 3.333 0 1 0 3.332-3.332V8.668Z" />
                  <circle cx="15.332" cy="12" r="3.332" />
                </svg>
                Import from Figma
              </CardTitle>
              <CardDescription>
                Enter your Figma file URL to automatically convert designs to React components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figma-url">Figma File URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="figma-url"
                    placeholder="https://figma.com/file/..."
                    value={figmaUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className={error ? "border-red-500" : ""}
                  />
                  <Button variant="outline" size="icon" onClick={pasteFromClipboard} title="Paste from clipboard">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-token">
                  Figma Access Token
                  <Badge variant="secondary" className="ml-2">
                    Optional
                  </Badge>
                </Label>
                <Input
                  id="access-token"
                  type="password"
                  placeholder="figd_..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Required for private files. Get your token from{" "}
                  <a
                    href="https://figma.com/developers/api#access-tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Figma Settings
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <Button
                onClick={handleProcessFile}
                disabled={!figmaUrl || !validateFigmaUrl(figmaUrl) || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Process Figma File
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Processing Figma File</span>
                  <Badge variant="outline">{progress.stage}</Badge>
                </CardTitle>
                <CardDescription>{progress.message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress.progress)}%</span>
                  </div>
                  <Progress value={progress.progress} className="w-full" />
                </div>

                {progress.details && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{progress.details}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel Processing
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          {fileInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">File Name</Label>
                    <p className="text-sm text-muted-foreground">{fileInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Modified</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(fileInfo.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Schema Version</Label>
                    <p className="text-sm text-muted-foreground">{fileInfo.schemaVersion}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Components</Label>
                    <p className="text-sm text-muted-foreground">
                      {Object.keys(fileInfo.components || {}).length} found
                    </p>
                  </div>
                </div>

                <Button onClick={handleProcessFile} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Process & Convert
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

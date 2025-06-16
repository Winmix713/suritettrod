"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Zap, Brain } from "lucide-react"

interface AIGenerationResult {
  result?: string
  error?: string
}

export function AIProviderClient() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<"groq" | "openai">("groq")

  const generateCode = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          provider,
          options: {
            maxTokens: 2000,
            temperature: 0.2,
          },
        }),
      })

      const data: AIGenerationResult = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data.result || "No result generated")
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Code Generation</span>
          </CardTitle>
          <CardDescription>Generate React components using AI (server-side secure)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Provider Selection */}
          <div className="flex space-x-2">
            <Button
              variant={provider === "groq" ? "default" : "outline"}
              onClick={() => setProvider("groq")}
              className="flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Groq (Fast)</span>
            </Button>
            <Button
              variant={provider === "openai" ? "default" : "outline"}
              onClick={() => setProvider("openai")}
              className="flex items-center space-x-2"
            >
              <Brain className="w-4 h-4" />
              <span>OpenAI (Premium)</span>
            </Button>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe the component you want to create:</label>
            <Textarea
              placeholder="Create a modern login form with email and password fields, using Tailwind CSS..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          {/* Generate Button */}
          <Button onClick={generateCode} disabled={loading || !prompt.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Component
              </>
            )}
          </Button>

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated Code:</label>
                <Badge variant="secondary">{provider.toUpperCase()}</Badge>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure AI Integration:</strong> All API keys are stored server-side only. Your prompts are processed
          securely without exposing sensitive credentials to the client.
        </AlertDescription>
      </Alert>
    </div>
  )
}

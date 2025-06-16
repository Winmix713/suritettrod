"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CheckItem {
  name: string
  description: string
  status: "success" | "warning" | "error" | "pending"
  required: boolean
}

export function DeploymentChecklist() {
  const [checks, setChecks] = useState<CheckItem[]>([
    {
      name: "Figma API Token",
      description: "Required for accessing Figma designs",
      status: "pending",
      required: true,
    },
    {
      name: "Groq API Key",
      description: "Required for AI code generation",
      status: "pending",
      required: true,
    },
    {
      name: "GitHub OAuth",
      description: "Required for repository creation",
      status: "pending",
      required: true,
    },
    {
      name: "NextAuth Secret",
      description: "Required for authentication",
      status: "pending",
      required: true,
    },
    {
      name: "OpenAI API Key",
      description: "Optional for premium AI features",
      status: "pending",
      required: false,
    },
  ])

  const [isVercelReady, setIsVercelReady] = useState(false)

  useEffect(() => {
    // Check environment variables
    const checkEnvironment = async () => {
      try {
        const response = await fetch("/api/environment/status")
        if (response.ok) {
          const data = await response.json()

          // Update checks based on response
          setChecks([
            {
              name: "Figma API Token",
              description: "Required for accessing Figma designs",
              status: data.figma.configured ? "success" : "error",
              required: true,
            },
            {
              name: "Groq API Key",
              description: "Required for AI code generation",
              status: data.groq.configured ? "success" : "error",
              required: true,
            },
            {
              name: "GitHub OAuth",
              description: "Required for repository creation",
              status: data.github.configured ? "success" : "error",
              required: true,
            },
            {
              name: "NextAuth Secret",
              description: "Required for authentication",
              status: data.environment.nextAuthConfigured ? "success" : "error",
              required: true,
            },
            {
              name: "OpenAI API Key",
              description: "Optional for premium AI features",
              status: data.openai.configured ? "success" : "warning",
              required: false,
            },
          ])

          // Check if ready for Vercel deployment
          const requiredChecks = checks.filter((check) => check.required)
          const allRequiredPassed = requiredChecks.every((check) => check.status === "success")
          setIsVercelReady(allRequiredPassed)
        }
      } catch (error) {
        console.error("Error checking environment:", error)
      }
    }

    checkEnvironment()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ready</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Optional</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Missing</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Checking...</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vercel Deployment Checklist</CardTitle>
        <CardDescription>Verify all required configurations before deploying to Vercel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <h4 className="font-medium">{check.name}</h4>
                  <p className="text-sm text-muted-foreground">{check.description}</p>
                </div>
              </div>
              {getStatusBadge(check.status)}
            </div>
          ))}
        </div>

        {isVercelReady ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-800">
              <strong>Ready for deployment!</strong> All required environment variables are configured.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-800">
              <strong>Not ready for deployment.</strong> Please configure all required environment variables.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button size="lg" disabled={!isVercelReady} onClick={() => window.open("https://vercel.com/new", "_blank")}>
            Deploy to Vercel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

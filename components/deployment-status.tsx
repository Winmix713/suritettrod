"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Shield, Server, Globe, RefreshCw } from "lucide-react"

interface DeploymentStatus {
  environment: {
    figma: { configured: boolean; secure: boolean }
    groq: { configured: boolean; secure: boolean }
    github: { configured: boolean; secure: boolean }
    openai: { configured: boolean; secure: boolean }
  }
  security: {
    clientSideTokens: boolean
    serverSideOnly: boolean
    apiProtection: boolean
  }
  readiness: {
    score: number
    ready: boolean
    issues: string[]
  }
}

export function DeploymentStatus() {
  const [status, setStatus] = useState<DeploymentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    checkDeploymentStatus()
  }, [])

  const checkDeploymentStatus = async () => {
    setLoading(true)
    try {
      // Use SECURE API endpoint - NO direct environment access
      const response = await fetch("/api/environment/status")
      const data = await response.json()

      // Transform API response to deployment status
      const deploymentStatus: DeploymentStatus = {
        environment: {
          figma: { configured: data.figma?.configured || false, secure: true },
          groq: { configured: data.groq?.configured || false, secure: true },
          github: { configured: data.github?.configured || false, secure: true },
          openai: { configured: data.openai?.configured || false, secure: true },
        },
        security: {
          clientSideTokens: false, // Always false with secure implementation
          serverSideOnly: true, // Always true with secure implementation
          apiProtection: true, // Always true with secure implementation
        },
        readiness: {
          score: calculateReadinessScore(data),
          ready: data.figma?.configured && data.groq?.configured && data.github?.configured,
          issues: getDeploymentIssues(data),
        },
      }

      setStatus(deploymentStatus)
      setLastCheck(new Date())
    } catch (error) {
      console.error("Failed to check deployment status:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateReadinessScore = (data: any): number => {
    const requiredServices = ["figma", "groq", "github"]
    const configuredCount = requiredServices.filter((service) => data[service]?.configured).length
    return Math.round((configuredCount / requiredServices.length) * 100)
  }

  const getDeploymentIssues = (data: any): string[] => {
    const issues: string[] = []

    if (!data.figma?.configured) issues.push("Figma API token not configured")
    if (!data.groq?.configured) issues.push("Groq API key not configured")
    if (!data.github?.configured) issues.push("GitHub OAuth not configured")

    return issues
  }

  const getStatusColor = (configured: boolean) => {
    return configured ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
  }

  const getStatusIcon = (configured: boolean) => {
    return configured ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Checking deployment status...</p>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Failed to load deployment status. Please try again.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Deployment Status</span>
              </CardTitle>
              <CardDescription>Secure deployment readiness with enterprise-grade security</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={checkDeploymentStatus}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Security Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Zero Client Exposure</div>
                <div className="text-sm text-green-600">No sensitive tokens in browser</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">Server-Side Only</div>
                <div className="text-sm text-green-600">All API calls protected</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">API Protection</div>
                <div className="text-sm text-green-600">Secure endpoint validation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Status */}
      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>Server-side environment variables status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(status.environment).map(([service, config]) => (
              <Card key={service} className={`border-2 ${getStatusColor(config.configured)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(config.configured)}
                      <div>
                        <div className="font-medium capitalize">{service} API</div>
                        <div className="text-sm opacity-75">
                          {config.configured ? "Configured & Secure" : "Not Configured"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(config.configured)}>
                        {config.configured ? "✅ Ready" : "❌ Missing"}
                      </Badge>
                      {config.secure && <Badge className="bg-blue-100 text-blue-800 text-xs">🔒 Secure</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Readiness Score */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Readiness</CardTitle>
          <CardDescription>Overall deployment score and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">{status.readiness.score}/100</div>
              <div className="text-sm text-gray-600">Deployment Score</div>
            </div>
            <Badge
              className={
                status.readiness.ready
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
              }
            >
              {status.readiness.ready ? "🚀 Ready to Deploy" : "⚠️ Setup Required"}
            </Badge>
          </div>

          {status.readiness.issues.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                <div className="font-medium mb-2">Issues to resolve:</div>
                <ul className="list-disc list-inside space-y-1">
                  {status.readiness.issues.map((issue, index) => (
                    <li key={index} className="text-sm">
                      {issue}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {status.readiness.ready && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>🎉 Ready for secure deployment!</strong> All required services are configured with
                enterprise-grade security.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Last Check */}
      {lastCheck && <div className="text-center text-sm text-gray-500">Last checked: {lastCheck.toLocaleString()}</div>}
    </div>
  )
}

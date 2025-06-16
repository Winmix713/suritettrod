"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Settings, Key, Github, Zap, Palette, AlertTriangle } from "lucide-react"

interface ServiceStatus {
  name: string
  status: "ready" | "error" | "loading" | "optional" | "not_configured"
  icon: JSX.Element
  description: string
}

export function EnvironmentStatusDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Figma API",
      status: "loading",
      icon: <Palette className="w-4 h-4" />,
      description: "Checking connection...",
    },
    {
      name: "Groq AI",
      status: "loading",
      icon: <Zap className="w-4 h-4" />,
      description: "Checking connection...",
    },
    {
      name: "GitHub OAuth",
      status: "loading",
      icon: <Github className="w-4 h-4" />,
      description: "Checking configuration...",
    },
    {
      name: "OpenAI",
      status: "loading",
      icon: <Settings className="w-4 h-4" />,
      description: "Checking connection...",
    },
  ])

  useEffect(() => {
    // Check environment status
    async function checkEnvironmentStatus() {
      try {
        const response = await fetch("/api/environment/status")
        if (response.ok) {
          const data = await response.json()

          // Update services based on response
          setServices([
            {
              name: "Figma API",
              status: data.figma.configured ? "ready" : "error",
              icon: <Palette className="w-4 h-4" />,
              description: data.figma.configured ? "Connected and ready to fetch designs" : "Not configured properly",
            },
            {
              name: "Groq AI",
              status: data.groq.configured ? "ready" : "error",
              icon: <Zap className="w-4 h-4" />,
              description: data.groq.configured ? "AI code generation available" : "API key missing or invalid",
            },
            {
              name: "GitHub OAuth",
              status: data.github.configured ? "ready" : "error",
              icon: <Github className="w-4 h-4" />,
              description: data.github.configured ? "Repository creation enabled" : "OAuth credentials missing",
            },
            {
              name: "OpenAI",
              status: data.openai.configured ? "ready" : "optional",
              icon: <Settings className="w-4 h-4" />,
              description: data.openai.configured ? "Premium AI features available" : "Premium AI features (optional)",
            },
          ])
        } else {
          throw new Error("Failed to fetch environment status")
        }
      } catch (error) {
        console.error("Error checking environment status:", error)
        // Set fallback status based on environment variables
        setServices([
          {
            name: "Figma API",
            status: process.env.FIGMA_ACCESS_TOKEN ? "ready" : "error",
            icon: <Palette className="w-4 h-4" />,
            description: process.env.FIGMA_ACCESS_TOKEN
              ? "Connected and ready to fetch designs"
              : "Not configured properly",
          },
          {
            name: "Groq AI",
            status: process.env.NEXT_PUBLIC_GROQ_API_KEY ? "ready" : "error",
            icon: <Zap className="w-4 h-4" />,
            description: process.env.NEXT_PUBLIC_GROQ_API_KEY
              ? "AI code generation available"
              : "API key missing or invalid",
          },
          {
            name: "GitHub OAuth",
            status: process.env.GITHUB_CLIENT_ID ? "ready" : "error",
            icon: <Github className="w-4 h-4" />,
            description: process.env.GITHUB_CLIENT_ID ? "Repository creation enabled" : "OAuth credentials missing",
          },
          {
            name: "OpenAI",
            status: process.env.OPENAI_API_KEY ? "ready" : "optional",
            icon: <Settings className="w-4 h-4" />,
            description: process.env.OPENAI_API_KEY
              ? "Premium AI features available"
              : "Premium AI features (optional)",
          },
        ])
      }
    }

    checkEnvironmentStatus()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800 border-green-200"
      case "optional":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "loading":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const allCoreServicesReady = services.filter((s) => s.name !== "OpenAI").every((s) => s.status === "ready")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>Environment Status</span>
          </CardTitle>
          <CardDescription>Current configuration and service availability</CardDescription>
        </CardHeader>
        <CardContent>
          {allCoreServicesReady ? (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>All core services are configured and ready!</strong>
                You can start converting Figma designs immediately.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Some services need configuration!</strong>
                Please check the service status below and configure missing services.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.name} className={`border-2 ${getStatusColor(service.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {service.icon}
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(service.status)}>
                  {service.status === "ready" && "✅ Ready"}
                  {service.status === "optional" && "⚠️ Optional"}
                  {service.status === "error" && "❌ Not Configured"}
                  {service.status === "loading" && "⏳ Loading..."}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Ready to begin converting your Figma designs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Environment Variables Configured:</h4>
            <div className="space-y-1 text-sm font-mono">
              <div className="flex justify-between">
                <span>FIGMA_ACCESS_TOKEN</span>
                <Badge
                  className={services[0].status === "ready" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {services[0].status === "ready" ? "✅" : "❌"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>GROQ_API_KEY</span>
                <Badge
                  className={services[1].status === "ready" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {services[1].status === "ready" ? "✅" : "❌"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>GITHUB_CLIENT_ID</span>
                <Badge
                  className={services[2].status === "ready" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {services[2].status === "ready" ? "✅" : "❌"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>OPENAI_API_KEY</span>
                <Badge className="bg-yellow-100 text-yellow-800">{services[3].status === "ready" ? "✅" : "⚠️"}</Badge>
              </div>
            </div>
          </div>

          <Alert>
            {allCoreServicesReady ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>🎉 Ready to use!</strong> Switch to the Converter tab to start transforming your Figma designs
                  into React components.
                </AlertDescription>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>⚠️ Configuration needed!</strong> Please set up the missing environment variables to enable all
                  features.
                </AlertDescription>
              </>
            )}
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

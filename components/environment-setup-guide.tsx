"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Copy, Settings, Terminal, Play } from "lucide-react"

export function EnvironmentSetupGuide() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(item)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  // SECURE environment variables - NO client-side token references
  const envVariables = `# 🎨 Figma Integration (SERVER-SIDE ONLY)
FIGMA_ACCESS_TOKEN="your_figma_access_token_here"

# 🤖 AI Providers (SERVER-SIDE ONLY)
GROQ_API_KEY="your_groq_api_key_here"
OPENAI_API_KEY="your_openai_api_key_here"
OPENAI_MODEL="gpt-4o"

# 🐙 GitHub Integration (SERVER-SIDE ONLY)
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"

# 🔧 Application Settings
NODE_ENV="development"
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"`

  const setupSteps = [
    {
      title: "1. Create .env.local file",
      description: "Create a .env.local file in your project root",
      command: "touch .env.local",
      status: "required",
    },
    {
      title: "2. Add environment variables",
      description: "Copy the secure environment variables to your .env.local file",
      command: "# Copy the variables above",
      status: "required",
    },
    {
      title: "3. Install dependencies",
      description: "Install all required npm packages",
      command: "npm install",
      status: "required",
    },
    {
      title: "4. Validate environment",
      description: "Run environment validation script",
      command: "npm run validate:env",
      status: "recommended",
    },
    {
      title: "5. Start development server",
      description: "Launch the application in development mode",
      command: "npm run dev",
      status: "required",
    },
  ]

  const auditCommands = [
    {
      name: "Component Audit",
      command: "npm run audit:components",
      description: "Analyze missing and existing components",
    },
    {
      name: "Testing Strategy",
      command: "npm run audit:testing",
      description: "Review testing approach and coverage",
    },
    {
      name: "Project Analysis",
      command: "npm run audit:project",
      description: "Complete project status analysis",
    },
    {
      name: "Environment Validation",
      command: "npm run validate:env",
      description: "Validate all environment variables",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Secure Environment Setup Guide</span>
          </CardTitle>
          <CardDescription>
            Complete setup guide for the Figma-to-React Converter with enterprise security
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Setup Steps</TabsTrigger>
          <TabsTrigger value="environment">Environment Variables</TabsTrigger>
          <TabsTrigger value="scripts">Audit Scripts</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <Badge variant={step.status === "required" ? "default" : "secondary"}>{step.status}</Badge>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                    <span>{step.command}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(step.command, `step-${index}`)}>
                      {copiedItem === `step-${index}` ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>All API keys are configured for server-side only!</strong> This ensures enterprise-grade security
              with zero client-side exposure.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Secure Environment Variables</CardTitle>
                  <CardDescription>Copy these variables to your .env.local file (SERVER-SIDE ONLY)</CardDescription>
                </div>
                <Button
                  onClick={() => copyToClipboard(envVariables, "env-vars")}
                  className="flex items-center space-x-2"
                >
                  {copiedItem === "env-vars" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Copy All</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm whitespace-pre-wrap">{envVariables}</pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Secure Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Figma API</span>
                  <Badge className="bg-green-100 text-green-800">🔒 Server-only</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Groq AI</span>
                  <Badge className="bg-green-100 text-green-800">🔒 Server-only</Badge>
                </div>
                <div className="flex justify-between">
                  <span>GitHub OAuth</span>
                  <Badge className="bg-green-100 text-green-800">🔒 Server-only</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Security Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Zero Client Exposure</span>
                  <Badge className="bg-blue-100 text-blue-800">✅ Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>API Route Protection</span>
                  <Badge className="bg-blue-100 text-blue-800">✅ Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Server-side Validation</span>
                  <Badge className="bg-blue-100 text-blue-800">✅ Enabled</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditCommands.map((audit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Terminal className="w-5 h-5" />
                    <span>{audit.name}</span>
                  </CardTitle>
                  <CardDescription>{audit.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                    <span>{audit.command}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(audit.command, `audit-${index}`)}>
                      {copiedItem === `audit-${index}` ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Run All Audits</CardTitle>
              <CardDescription>Execute all audit scripts at once for complete project analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                <span>npm run audit:all</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard("npm run audit:all", "audit-all")}>
                  {copiedItem === "audit-all" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Play className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> All audit scripts now use secure server-side API endpoints with zero
              client-side token exposure.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}

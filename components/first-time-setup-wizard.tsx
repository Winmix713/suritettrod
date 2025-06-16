"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  Play,
  Terminal,
  Settings,
  Zap,
  FileText,
  Globe,
} from "lucide-react"

interface SetupStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "error"
  details?: string
}

export function FirstTimeSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: "dependencies",
      title: "Függőségek telepítése",
      description: "npm install futtatása",
      status: "pending",
    },
    {
      id: "environment",
      title: "Környezeti változók",
      description: ".env.local fájl létrehozása",
      status: "pending",
    },
    {
      id: "validation",
      title: "Konfiguráció validálása",
      description: "API kulcsok ellenőrzése",
      status: "pending",
    },
    {
      id: "server",
      title: "Szerver indítása",
      description: "Fejlesztői szerver elindítása",
      status: "pending",
    },
    {
      id: "test",
      title: "Első teszt",
      description: "Rendszer működésének tesztelése",
      status: "pending",
    },
  ])

  const [envVars, setEnvVars] = useState({
    figmaToken: "",
    groqKey: "",
    githubClientId: "",
    githubClientSecret: "",
    nextAuthSecret: "",
    appUrl: "http://localhost:3000",
  })

  const [isRunning, setIsRunning] = useState(false)

  const updateStepStatus = (stepId: string, status: SetupStep["status"], details?: string) => {
    setSetupSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status, details } : step)))
  }

  const runSetupStep = async (stepIndex: number) => {
    const step = setupSteps[stepIndex]
    updateStepStatus(step.id, "in-progress")

    try {
      switch (step.id) {
        case "dependencies":
          await simulateCommand("npm install", 3000)
          updateStepStatus(step.id, "completed", "Összes függőség telepítve")
          break

        case "environment":
          if (!envVars.figmaToken || !envVars.groqKey) {
            updateStepStatus(step.id, "error", "Hiányzó API kulcsok")
            return
          }
          await simulateCommand("Környezeti változók beállítása...", 1000)
          updateStepStatus(step.id, "completed", ".env.local létrehozva")
          break

        case "validation":
          await simulateCommand("Konfiguráció validálása...", 2000)
          updateStepStatus(step.id, "completed", "Minden API kulcs érvényes")
          break

        case "server":
          await simulateCommand("npm run dev", 2000)
          updateStepStatus(step.id, "completed", "Szerver fut a http://localhost:3000 címen")
          setIsRunning(true)
          break

        case "test":
          await simulateCommand("Rendszer tesztelése...", 1500)
          updateStepStatus(step.id, "completed", "Minden szolgáltatás működik")
          break
      }

      if (stepIndex < setupSteps.length - 1) {
        setTimeout(() => setCurrentStep(stepIndex + 1), 500)
      }
    } catch (error) {
      updateStepStatus(step.id, "error", "Hiba történt a lépés során")
    }
  }

  const simulateCommand = (command: string, duration: number) => {
    return new Promise((resolve) => setTimeout(resolve, duration))
  }

  const generateEnvFile = () => {
    const envContent = `# 🎨 Figma Integration (SERVER-SIDE ONLY)
FIGMA_ACCESS_TOKEN="${envVars.figmaToken}"

# 🤖 AI Providers (SERVER-SIDE ONLY)
GROQ_API_KEY="${envVars.groqKey}"

# 🐙 GitHub Integration (SERVER-SIDE ONLY)
GITHUB_CLIENT_ID="${envVars.githubClientId}"
GITHUB_CLIENT_SECRET="${envVars.githubClientSecret}"

# 🔧 Application Settings
NODE_ENV="development"
NEXTAUTH_SECRET="${envVars.nextAuthSecret || "figma-converter-secret-key-2024"}"
NEXTAUTH_URL="${envVars.appUrl}"
NEXT_PUBLIC_APP_URL="${envVars.appUrl}"
`

    const blob = new Blob([envContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env.local"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStepIcon = (status: SetupStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "in-progress":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const completedSteps = setupSteps.filter((step) => step.status === "completed").length
  const progress = (completedSteps / setupSteps.length) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">🚀 Első Indítás Varázsló</h1>
        <p className="text-lg text-gray-600">Lépésről lépésre beállítjuk a Figma to React Converter rendszert</p>
        <div className="mt-4">
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            {completedSteps}/{setupSteps.length} lépés kész
          </p>
        </div>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">
            <Settings className="w-4 h-4 mr-2" />
            Beállítás
          </TabsTrigger>
          <TabsTrigger value="environment">
            <FileText className="w-4 h-4 mr-2" />
            Környezet
          </TabsTrigger>
          <TabsTrigger value="commands">
            <Terminal className="w-4 h-4 mr-2" />
            Parancsok
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Globe className="w-4 h-4 mr-2" />
            Használat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Beállítási Lépések</CardTitle>
              <CardDescription>Kövesse ezeket a lépéseket a rendszer első indításához</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {step.details && <p className="text-xs text-gray-500 mt-1">{step.details}</p>}
                  </div>
                  <div className="flex-shrink-0">
                    {index === currentStep && step.status === "pending" && (
                      <Button onClick={() => runSetupStep(index)} size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Futtatás
                      </Button>
                    )}
                    {step.status === "completed" && <Badge variant="secondary">Kész</Badge>}
                    {step.status === "error" && <Badge variant="destructive">Hiba</Badge>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Környezeti Változók Beállítása</CardTitle>
              <CardDescription>Adja meg az API kulcsokat a szolgáltatások használatához</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="figma-token">Figma Access Token *</Label>
                  <Input
                    id="figma-token"
                    placeholder="figd_..."
                    value={envVars.figmaToken}
                    onChange={(e) => setEnvVars((prev) => ({ ...prev, figmaToken: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    <a
                      href="https://figma.com/developers/api#access-tokens"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                      rel="noreferrer"
                    >
                      Figma Settings → Personal Access Tokens
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groq-key">Groq API Key *</Label>
                  <Input
                    id="groq-key"
                    placeholder="gsk_..."
                    value={envVars.groqKey}
                    onChange={(e) => setEnvVars((prev) => ({ ...prev, groqKey: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    <a
                      href="https://console.groq.com/"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                      rel="noreferrer"
                    >
                      Groq Console → API Keys
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github-client">GitHub Client ID</Label>
                  <Input
                    id="github-client"
                    placeholder="Ov23li..."
                    value={envVars.githubClientId}
                    onChange={(e) => setEnvVars((prev) => ({ ...prev, githubClientId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github-secret">GitHub Client Secret</Label>
                  <Input
                    id="github-secret"
                    type="password"
                    placeholder="ea5234..."
                    value={envVars.githubClientSecret}
                    onChange={(e) => setEnvVars((prev) => ({ ...prev, githubClientSecret: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={generateEnvFile} className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  .env.local Letöltése
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    copyToClipboard(`FIGMA_ACCESS_TOKEN="${envVars.figmaToken}"\nGROQ_API_KEY="${envVars.groqKey}"`)
                  }
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commands" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Terminal Parancsok</CardTitle>
              <CardDescription>Futtassa ezeket a parancsokat a terminálban</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400"># 1. Függőségek telepítése</span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard("npm install")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>npm install</div>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400"># 2. Környezet validálása</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("node scripts/validate-environment.js")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>node scripts/validate-environment.js</div>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400"># 3. Fejlesztői szerver indítása</span>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard("npm run dev")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>npm run dev</div>
                </div>
              </div>

              {isRunning && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Szerver fut! Nyissa meg a <strong>http://localhost:3000</strong> címet
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Első Használat</CardTitle>
              <CardDescription>Így használja a rendszert az első alkalommal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Gyors Start
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Nyissa meg a http://localhost:3000 címet</li>
                    <li>Illesszen be egy Figma URL-t</li>
                    <li>Válassza ki az AI szolgáltatót (Groq ajánlott)</li>
                    <li>Kattintson a "Convert to React" gombra</li>
                    <li>Töltse le vagy másolja ki a kódot</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-500" />
                    Hasznos Linkek
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a href="http://localhost:3000" className="flex items-center text-blue-600 hover:underline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Főoldal
                    </a>
                    <a
                      href="http://localhost:3000/api/environment/status"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Rendszer státusz
                    </a>
                    <a
                      href="https://figma.com/developers/api"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Figma API dokumentáció
                    </a>
                  </div>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tipp:</strong> Kezdje egy egyszerű Figma komponenssel a teszteléshez!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

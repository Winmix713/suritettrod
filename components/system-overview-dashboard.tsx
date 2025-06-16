"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Palette,
  Code,
  Zap,
  Shield,
  Github,
  Download,
  Eye,
  Rocket,
  CheckCircle,
  Database,
  Cpu,
  Lock,
} from "lucide-react"

export function SystemOverviewDashboard() {
  const [activeDemo, setActiveDemo] = useState("figma-import")

  const systemStats = {
    totalComponents: 150,
    activeUsers: 1250,
    conversionsToday: 89,
    successRate: 94.7,
    avgProcessingTime: 2.3,
    uptime: 99.9,
  }

  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Figma Integration",
      description: "Biztonságos Figma API integráció szerver-oldali token kezeléssel",
      status: "production",
      details: ["File import", "Component extraction", "Layer analysis", "Asset management"],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI Code Generation",
      description: "Groq és OpenAI alapú React komponens generálás",
      status: "production",
      details: ["Groq (ingyenes)", "OpenAI (prémium)", "Template matching", "Code optimization"],
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "React Components",
      description: "TypeScript, Tailwind CSS és modern React patterns",
      status: "production",
      details: ["TypeScript support", "Tailwind CSS", "Responsive design", "Accessibility"],
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export System",
      description: "ZIP letöltés és GitHub repository létrehozás",
      status: "production",
      details: ["ZIP export", "GitHub integration", "Project templates", "Documentation"],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Zero client-side token exposure, OWASP compliance",
      status: "production",
      details: ["Server-side API calls", "Input validation", "Rate limiting", "CORS protection"],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "Valós idejű komponens előnézet és szerkesztés",
      status: "production",
      details: ["Live rendering", "Interactive preview", "Code highlighting", "Error handling"],
    },
  ]

  const techStack = {
    frontend: ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS", "Radix UI"],
    backend: ["Next.js API Routes", "Server Actions", "Zod Validation"],
    ai: ["Groq API", "OpenAI API", "AI SDK", "Custom Prompts"],
    integrations: ["Figma API", "GitHub API", "Vercel Deployment"],
    security: ["Server-side tokens", "Input validation", "Rate limiting", "CORS"],
  }

  const workflowSteps = [
    {
      step: 1,
      title: "Figma URL Import",
      description: "Felhasználó beilleszti a Figma file URL-t",
      icon: <Palette className="w-5 h-5" />,
      status: "completed",
    },
    {
      step: 2,
      title: "Secure API Call",
      description: "Szerver-oldali Figma API hívás token védelemmel",
      icon: <Shield className="w-5 h-5" />,
      status: "completed",
    },
    {
      step: 3,
      title: "Design Analysis",
      description: "AI elemzi a design struktúrát és komponenseket",
      icon: <Zap className="w-5 h-5" />,
      status: "completed",
    },
    {
      step: 4,
      title: "Code Generation",
      description: "React komponens generálás TypeScript-tel",
      icon: <Code className="w-5 h-5" />,
      status: "completed",
    },
    {
      step: 5,
      title: "Live Preview",
      description: "Valós idejű előnézet és szerkesztési lehetőség",
      icon: <Eye className="w-5 h-5" />,
      status: "completed",
    },
    {
      step: 6,
      title: "Export Options",
      description: "ZIP letöltés vagy GitHub repository létrehozás",
      icon: <Download className="w-5 h-5" />,
      status: "completed",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Figma to React Converter
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Enterprise-szintű, AI-alapú alkalmazás Figma tervek production-ready React komponensekké alakítására. Teljes
          biztonsággal, szerver-oldali API kezeléssel.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Production Ready
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Enterprise Security
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{systemStats.totalComponents}</div>
            <div className="text-sm text-muted-foreground">Komponens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</div>
            <div className="text-sm text-muted-foreground">Aktív felhasználó</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{systemStats.conversionsToday}</div>
            <div className="text-sm text-muted-foreground">Mai konverzió</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{systemStats.successRate}%</div>
            <div className="text-sm text-muted-foreground">Sikerességi arány</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{systemStats.avgProcessingTime}s</div>
            <div className="text-sm text-muted-foreground">Átlag feldolgozás</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{systemStats.uptime}%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="features">Funkciók</TabsTrigger>
          <TabsTrigger value="workflow">Munkafolyamat</TabsTrigger>
          <TabsTrigger value="architecture">Architektúra</TabsTrigger>
          <TabsTrigger value="security">Biztonság</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
        </TabsList>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{feature.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge
                        className={
                          feature.status === "production"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {feature.status === "production" ? "Éles" : "Fejlesztés alatt"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent value="workflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendszer Munkafolyamat</CardTitle>
              <CardDescription>A teljes konverziós folyamat lépésről lépésre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {step.icon}
                        <h3 className="font-semibold">{step.title}</h3>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span>Technológiai Stack</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(techStack).map(([category, technologies]) => (
                  <div key={category}>
                    <h4 className="font-semibold capitalize mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Rendszer Architektúra</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Client Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Next.js frontend React komponensekkel, Tailwind CSS styling
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">API Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      Next.js API Routes szerver-oldali logikával és validációval
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">External APIs</h4>
                    <p className="text-sm text-muted-foreground">Figma API, Groq AI, OpenAI, GitHub API integrációk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Enterprise-szintű biztonság:</strong> Minden API kulcs szerver-oldalon tárolva, zero client-side
              exposure.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Biztonsági Funkciók</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Server-side API token management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Input validation és sanitization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Rate limiting és DDoS védelem</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">CORS policy konfigurálva</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">OWASP Top 10 compliance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biztonsági Architektúra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                    <strong>Browser (Client)</strong>
                    <br />
                    Csak UI komponensek, ZERO API kulcs
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                    <strong>Next.js API Routes</strong>
                    <br />
                    Biztonságos proxy layer validációval
                  </div>
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <strong>External APIs</strong>
                    <br />
                    Figma, AI szolgáltatások védett hozzáféréssel
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interaktív Demo</CardTitle>
              <CardDescription>Próbálja ki a rendszer főbb funkcióit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Button
                  variant={activeDemo === "figma-import" ? "default" : "outline"}
                  onClick={() => setActiveDemo("figma-import")}
                  className="h-20 flex-col"
                >
                  <Palette className="w-6 h-6 mb-2" />
                  Figma Import
                </Button>
                <Button
                  variant={activeDemo === "ai-generation" ? "default" : "outline"}
                  onClick={() => setActiveDemo("ai-generation")}
                  className="h-20 flex-col"
                >
                  <Zap className="w-6 h-6 mb-2" />
                  AI Generálás
                </Button>
                <Button
                  variant={activeDemo === "export" ? "default" : "outline"}
                  onClick={() => setActiveDemo("export")}
                  className="h-20 flex-col"
                >
                  <Download className="w-6 h-6 mb-2" />
                  Export
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg min-h-[300px]">
                {activeDemo === "figma-import" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Figma File Import</h3>
                    <div className="bg-white p-4 rounded border">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Figma API kapcsolat aktív</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-blue-200 rounded">
                          <div className="h-2 bg-blue-600 rounded w-3/4"></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Figma file elemzése... Komponensek és layerek feltérképezése
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDemo === "ai-generation" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">AI Kód Generálás</h3>
                    <div className="bg-white p-4 rounded border">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span className="text-sm">Groq AI aktív</span>
                      </div>
                      <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                        <div>Generating React component...</div>
                        <div>✓ TypeScript interfaces</div>
                        <div>✓ Tailwind CSS classes</div>
                        <div>✓ Responsive design</div>
                        <div>✓ Accessibility features</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDemo === "export" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Export Opciók</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded border">
                        <Download className="w-8 h-8 text-blue-600 mb-2" />
                        <h4 className="font-semibold">ZIP Export</h4>
                        <p className="text-sm text-muted-foreground">Teljes projekt struktúra letöltése</p>
                      </div>
                      <div className="bg-white p-4 rounded border">
                        <Github className="w-8 h-8 text-gray-800 mb-2" />
                        <h4 className="font-semibold">GitHub Push</h4>
                        <p className="text-sm text-muted-foreground">Automatikus repository létrehozás</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Készen áll a használatra!</h2>
          <p className="text-blue-100 mb-6">
            A rendszer teljes mértékben konfigurálva és biztonságossá téve. Kezdje el a Figma tervek konvertálását még
            ma.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Rocket className="w-5 h-5 mr-2" />
              Kezdés
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

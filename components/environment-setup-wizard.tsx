"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Check, ExternalLink, Eye, EyeOff, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnvVariable {
  key: string
  value: string
  description: string
  required: boolean
  format?: string
  example?: string
  link?: string
}

export default function EnvironmentSetupWizard() {
  const { toast } = useToast()
  const [envVars, setEnvVars] = useState<EnvVariable[]>([
    {
      key: "FIGMA_ACCESS_TOKEN",
      value: "",
      description: "Figma Personal Access Token - szükséges a Figma API eléréséhez",
      required: true,
      format: "figd_",
      example: "figd_U2FsdGVkX1...",
      link: "https://www.figma.com/settings",
    },
    {
      key: "NEXT_PUBLIC_GROQ_API_KEY",
      value: "",
      description: "Groq API kulcs - AI kód generáláshoz",
      required: true,
      format: "gsk_",
      example: "gsk_...",
      link: "https://console.groq.com/",
    },
    {
      key: "GITHUB_CLIENT_ID",
      value: "",
      description: "GitHub OAuth Client ID - GitHub integrációhoz",
      required: true,
      example: "Ov23li...",
      link: "https://github.com/settings/developers",
    },
    {
      key: "GITHUB_CLIENT_SECRET",
      value: "",
      description: "GitHub OAuth Client Secret",
      required: true,
      example: "ea52342c...",
      link: "https://github.com/settings/developers",
    },
    {
      key: "NEXTAUTH_SECRET",
      value: "",
      description: "NextAuth titkosítási kulcs - autentikációhoz",
      required: true,
      example: "figma-converter-secret-key-2024",
    },
    {
      key: "NEXTAUTH_URL",
      value: "http://localhost:3000",
      description: "NextAuth callback URL",
      required: true,
      example: "http://localhost:3000",
    },
    {
      key: "NEXT_PUBLIC_APP_URL",
      value: "http://localhost:3000",
      description: "Alkalmazás publikus URL-je",
      required: true,
      example: "http://localhost:3000",
    },
    {
      key: "OPENAI_API_KEY",
      value: "",
      description: "OpenAI API kulcs - opcionális AI provider",
      required: false,
      format: "sk-",
      example: "sk-...",
      link: "https://platform.openai.com/api-keys",
    },
    {
      key: "OPENAI_MODEL",
      value: "gpt-4o",
      description: "OpenAI modell neve",
      required: false,
      example: "gpt-4o",
    },
  ])

  const [showValues, setShowValues] = useState<Record<string, boolean>>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const updateEnvVar = (key: string, value: string) => {
    setEnvVars((prev) => prev.map((env) => (env.key === key ? { ...env, value } : env)))
  }

  const toggleShowValue = (key: string) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast({
        title: "Másolva!",
        description: "A szöveg a vágólapra került.",
      })
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (err) {
      toast({
        title: "Hiba",
        description: "Nem sikerült másolni a szöveget.",
        variant: "destructive",
      })
    }
  }

  const generateEnvFile = () => {
    const envContent = envVars
      .map((env) => {
        const comment = `# ${env.description}`
        const line = `${env.key}="${env.value}"`
        return `${comment}\n${line}`
      })
      .join("\n\n")

    return `# 🎨 Figma Converter - Environment Variables
# Generálva: ${new Date().toLocaleString("hu-HU")}

${envContent}`
  }

  const downloadEnvFile = () => {
    const content = generateEnvFile()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env.local"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Letöltve!",
      description: ".env.local fájl sikeresen letöltve.",
    })
  }

  const validateFormat = (env: EnvVariable) => {
    if (!env.format || !env.value) return true
    return env.value.startsWith(env.format)
  }

  const requiredVars = envVars.filter((env) => env.required)
  const optionalVars = envVars.filter((env) => !env.required)
  const completedRequired = requiredVars.filter((env) => env.value.trim() !== "").length
  const completionPercentage = Math.round((completedRequired / requiredVars.length) * 100)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🔧 Környezeti Változók Beállítása</h1>
        <p className="text-muted-foreground">Állítsa be az összes szükséges API kulcsot és konfigurációt</p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
            {completedRequired}/{requiredVars.length} kötelező változó
          </Badge>
          <Badge variant="outline">{completionPercentage}% kész</Badge>
        </div>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Beállítás</TabsTrigger>
          <TabsTrigger value="preview">Előnézet</TabsTrigger>
          <TabsTrigger value="guide">Útmutató</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Kötelező Változók
                <Badge variant="destructive">{requiredVars.length}</Badge>
              </CardTitle>
              <CardDescription>Ezek a változók szükségesek az alkalmazás működéséhez</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {requiredVars.map((env) => (
                <div key={env.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={env.key} className="font-medium">
                      {env.key}
                    </Label>
                    <div className="flex items-center gap-2">
                      {env.link && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(env.link, "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toggleShowValue(env.key)}>
                        {showValues[env.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Input
                    id={env.key}
                    type={showValues[env.key] ? "text" : "password"}
                    value={env.value}
                    onChange={(e) => updateEnvVar(env.key, e.target.value)}
                    placeholder={env.example}
                    className={!validateFormat(env) ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-muted-foreground">{env.description}</p>
                  {env.format && !validateFormat(env) && env.value && (
                    <Alert>
                      <AlertDescription>⚠️ A formátum nem megfelelő. Várható: {env.format}...</AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Opcionális Változók
                <Badge variant="secondary">{optionalVars.length}</Badge>
              </CardTitle>
              <CardDescription>Ezek a változók további funkciókat biztosítanak</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {optionalVars.map((env) => (
                <div key={env.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={env.key} className="font-medium">
                      {env.key}
                    </Label>
                    <div className="flex items-center gap-2">
                      {env.link && (
                        <Button variant="ghost" size="sm" onClick={() => window.open(env.link, "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toggleShowValue(env.key)}>
                        {showValues[env.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Input
                    id={env.key}
                    type={showValues[env.key] ? "text" : "password"}
                    value={env.value}
                    onChange={(e) => updateEnvVar(env.key, e.target.value)}
                    placeholder={env.example}
                  />
                  <p className="text-sm text-muted-foreground">{env.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={downloadEnvFile} size="lg" disabled={completionPercentage < 100}>
              <Download className="h-4 w-4 mr-2" />
              .env.local Letöltése
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📄 .env.local Előnézet
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateEnvFile(), "envfile")}>
                  {copiedKey === "envfile" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={generateEnvFile()} readOnly className="min-h-[400px] font-mono text-sm" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>🎨 Figma Access Token</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  1. Menjen a{" "}
                  <a
                    href="https://www.figma.com/settings"
                    target="_blank"
                    className="text-blue-600 underline"
                    rel="noreferrer"
                  >
                    Figma Settings
                  </a>{" "}
                  oldalra
                </p>
                <p>2. Görgessen le a "Personal access tokens" részhez</p>
                <p>3. Kattintson a "Create new token" gombra</p>
                <p>4. Adjon nevet a tokennek és másolja ki</p>
                <p>5. A token "figd_" előtaggal kezdődik</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🤖 Groq API Key</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  1. Regisztráljon a{" "}
                  <a
                    href="https://console.groq.com/"
                    target="_blank"
                    className="text-blue-600 underline"
                    rel="noreferrer"
                  >
                    Groq Console
                  </a>{" "}
                  oldalon
                </p>
                <p>2. Menjen az "API Keys" részhez</p>
                <p>3. Hozzon létre új API kulcsot</p>
                <p>4. A kulcs "gsk_" előtaggal kezdődik</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🐙 GitHub OAuth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  1. Menjen a{" "}
                  <a
                    href="https://github.com/settings/developers"
                    target="_blank"
                    className="text-blue-600 underline"
                    rel="noreferrer"
                  >
                    GitHub Developer Settings
                  </a>{" "}
                  oldalra
                </p>
                <p>2. Kattintson a "New OAuth App" gombra</p>
                <p>3. Töltse ki az adatokat:</p>
                <ul className="ml-4 list-disc">
                  <li>Application name: Figma Converter</li>
                  <li>Homepage URL: http://localhost:3000</li>
                  <li>Authorization callback URL: http://localhost:3000/api/auth/callback/github</li>
                </ul>
                <p>4. Másolja ki a Client ID és Client Secret értékeket</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {completionPercentage === 100 && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>
            ✅ Minden kötelező változó be van állítva! Letöltheti a .env.local fájlt és elindíthatja a fejlesztést.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

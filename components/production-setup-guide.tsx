"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductionSetupGuide() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Production Deployment Guide</CardTitle>
          <CardDescription>Follow these steps to deploy your Figma Converter to Vercel</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Make sure to set up all required environment variables in your Vercel project.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="vercel">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="vercel">Vercel Deployment</TabsTrigger>
              <TabsTrigger value="env">Environment Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="vercel" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">1. Fork or Clone the Repository</h3>
                  <p className="text-muted-foreground mb-2">
                    Start by forking or cloning the repository to your GitHub account.
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                    git clone https://github.com/yourusername/figma-converter.git
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">2. Connect to Vercel</h3>
                  <p className="text-muted-foreground mb-2">
                    Import your repository to Vercel by connecting your GitHub account.
                  </p>
                  <Button onClick={() => window.open("https://vercel.com/new", "_blank")}>Import to Vercel</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">3. Configure Build Settings</h3>
                  <p className="text-muted-foreground mb-2">
                    Use the following build settings for optimal performance:
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-1">
                    <div>
                      Build Command: <span className="text-green-600">next build</span>
                    </div>
                    <div>
                      Output Directory: <span className="text-green-600">.next</span>
                    </div>
                    <div>
                      Install Command: <span className="text-green-600">npm install</span>
                    </div>
                    <div>
                      Node.js Version: <span className="text-green-600">18.x</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">4. Deploy</h3>
                  <p className="text-muted-foreground mb-2">
                    Click "Deploy" and wait for the build to complete. Your application will be available at a Vercel
                    URL.
                  </p>
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-800">
                      Vercel will automatically deploy new commits when you push to your repository.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="env" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Required Environment Variables</h3>
                  <p className="text-muted-foreground mb-2">
                    Add these environment variables to your Vercel project settings:
                  </p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">FIGMA_ACCESS_TOKEN</div>
                      <div>Your Figma personal access token</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">GROQ_API_KEY</div>
                      <div>Your Groq API key</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">GITHUB_CLIENT_ID</div>
                      <div>GitHub OAuth client ID</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">GITHUB_CLIENT_SECRET</div>
                      <div>GitHub OAuth client secret</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">NEXTAUTH_SECRET</div>
                      <div>Random string for NextAuth encryption</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">NEXTAUTH_URL</div>
                      <div>Your Vercel deployment URL</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">NEXT_PUBLIC_APP_URL</div>
                      <div>Your Vercel deployment URL</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">NEXT_PUBLIC_GROQ_API_KEY</div>
                      <div>Your Groq API key (for client-side)</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Optional Environment Variables</h3>
                  <p className="text-muted-foreground mb-2">These variables enable additional features:</p>
                  <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">OPENAI_API_KEY</div>
                      <div>Your OpenAI API key for premium AI features</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">OPENAI_MODEL</div>
                      <div>OpenAI model to use (default: gpt-4o)</div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Note:</strong> Never expose your API keys in client-side code. All sensitive
                    operations should be performed server-side.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

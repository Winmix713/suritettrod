import { DeploymentStatus } from "@/components/deployment-status"

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🚀 Production Deployment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Deploy your Figma-to-React Converter to production with Vercel
          </p>
        </div>

        <DeploymentStatus />
      </div>
    </div>
  )
}

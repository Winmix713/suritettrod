import { ProductionSetupGuide } from "@/components/production-setup-guide"

export default function ProductionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <ProductionSetupGuide />
      </div>
    </div>
  )
}

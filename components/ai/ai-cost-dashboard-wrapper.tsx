"use client"

import { AICostDashboard } from "./ai-cost-dashboard"
import { EnhancedErrorBoundary } from "../bug-fixes/error-boundary"

export function AICostDashboardWrapper() {
  return (
    <EnhancedErrorBoundary
      fallback={
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">AI Cost Dashboard Unavailable</h3>
          <p className="text-muted-foreground">
            There was an issue loading the cost dashboard. Please refresh the page.
          </p>
        </div>
      }
    >
      <AICostDashboard />
    </EnhancedErrorBoundary>
  )
}

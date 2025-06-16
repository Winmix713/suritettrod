import { promises as fs } from "fs"
import path from "path"
import { gzipSync } from "zlib"

interface BundleAnalysis {
  file: string
  size: number
  gzipSize: number
  category: "critical" | "important" | "optional"
  recommendations: string[]
}

interface PerformanceMetrics {
  totalBundleSize: number
  gzipSize: number
  componentCount: number
  largestComponents: BundleAnalysis[]
  recommendations: string[]
  score: number
}

export class PerformanceAuditor {
  private readonly MAX_BUNDLE_SIZE = 500 * 1024 // 500KB
  private readonly MAX_COMPONENT_SIZE = 50 * 1024 // 50KB
  private readonly CRITICAL_COMPONENTS = [
    "app/page.tsx",
    "components/figma-converter.tsx",
    "components/multi-step-wizard.tsx",
  ]

  async auditProject(): Promise<PerformanceMetrics> {
    console.log("🔍 Starting performance audit...")

    const components = await this.analyzeComponents()
    const bundleSize = await this.calculateBundleSize()
    const recommendations = this.generateRecommendations(components, bundleSize)

    const metrics: PerformanceMetrics = {
      totalBundleSize: bundleSize.total,
      gzipSize: bundleSize.gzip,
      componentCount: components.length,
      largestComponents: components.slice(0, 10),
      recommendations,
      score: this.calculateScore(bundleSize, components),
    }

    await this.generateReport(metrics)
    return metrics
  }

  private async analyzeComponents(): Promise<BundleAnalysis[]> {
    const components: BundleAnalysis[] = []
    const componentsDir = path.join(process.cwd(), "components")

    const analyzeDirectory = async (dir: string, prefix = "") => {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.join(prefix, entry.name)

        if (entry.isDirectory()) {
          await analyzeDirectory(fullPath, relativePath)
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
          const content = await fs.readFile(fullPath, "utf-8")
          const size = Buffer.byteLength(content, "utf-8")
          const gzipSize = gzipSync(content).length

          const analysis: BundleAnalysis = {
            file: `components/${relativePath}`,
            size,
            gzipSize,
            category: this.categorizeComponent(relativePath),
            recommendations: this.analyzeComponent(content, size),
          }

          components.push(analysis)
        }
      }
    }

    await analyzeDirectory(componentsDir)
    return components.sort((a, b) => b.size - a.size)
  }

  private categorizeComponent(filePath: string): "critical" | "important" | "optional" {
    if (this.CRITICAL_COMPONENTS.some((critical) => filePath.includes(critical))) {
      return "critical"
    }

    if (filePath.includes("figma/") || filePath.includes("ai/") || filePath.includes("export/")) {
      return "important"
    }

    return "optional"
  }

  private analyzeComponent(content: string, size: number): string[] {
    const recommendations: string[] = []

    // Check for large components
    if (size > this.MAX_COMPONENT_SIZE) {
      recommendations.push("Consider splitting into smaller components")
    }

    // Check for heavy imports
    const imports = content.match(/import.*from.*['"].*['"]/g) || []
    if (imports.length > 20) {
      recommendations.push("Too many imports - consider code splitting")
    }

    // Check for inline styles
    if (content.includes("style={{")) {
      recommendations.push("Move inline styles to CSS classes")
    }

    // Check for large data structures
    if (content.includes("const ") && content.match(/\[[\s\S]{500,}\]/)) {
      recommendations.push("Move large data structures to separate files")
    }

    // Check for missing React.memo
    if (content.includes("export function") && !content.includes("React.memo") && size > 10000) {
      recommendations.push("Consider using React.memo for performance")
    }

    return recommendations
  }

  private async calculateBundleSize(): Promise<{ total: number; gzip: number }> {
    let total = 0
    let gzipTotal = 0

    const calculateDir = async (dir: string) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true })

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name)

          if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
            await calculateDir(fullPath)
          } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
            const content = await fs.readFile(fullPath, "utf-8")
            const size = Buffer.byteLength(content, "utf-8")
            const gzipSize = gzipSync(content).length

            total += size
            gzipTotal += gzipSize
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    await calculateDir(process.cwd())
    return { total, gzip: gzipTotal }
  }

  private generateRecommendations(components: BundleAnalysis[], bundleSize: { total: number; gzip: number }): string[] {
    const recommendations: string[] = []

    // Bundle size recommendations
    if (bundleSize.total > this.MAX_BUNDLE_SIZE) {
      recommendations.push("Bundle size exceeds recommended limit - implement code splitting")
    }

    // Large component recommendations
    const largeComponents = components.filter((c) => c.size > this.MAX_COMPONENT_SIZE)
    if (largeComponents.length > 0) {
      recommendations.push(`${largeComponents.length} components are too large - consider refactoring`)
    }

    // Import optimization
    const heavyImports = components.filter((c) => c.recommendations.some((r) => r.includes("imports")))
    if (heavyImports.length > 5) {
      recommendations.push("Multiple components have heavy imports - implement lazy loading")
    }

    // Performance optimizations
    recommendations.push("Implement React.lazy for non-critical components")
    recommendations.push("Use dynamic imports for heavy libraries")
    recommendations.push("Consider using a bundler analyzer for detailed insights")

    return recommendations
  }

  private calculateScore(bundleSize: { total: number; gzip: number }, components: BundleAnalysis[]): number {
    let score = 100

    // Deduct points for large bundle
    if (bundleSize.total > this.MAX_BUNDLE_SIZE) {
      score -= 20
    }

    // Deduct points for large components
    const largeComponents = components.filter((c) => c.size > this.MAX_COMPONENT_SIZE)
    score -= largeComponents.length * 5

    // Deduct points for missing optimizations
    const unoptimized = components.filter((c) => c.recommendations.length > 2)
    score -= unoptimized.length * 2

    return Math.max(0, score)
  }

  private async generateReport(metrics: PerformanceMetrics): Promise<void> {
    const report = `
# Performance Audit Report

## 📊 Bundle Analysis
- **Total Bundle Size**: ${(metrics.totalBundleSize / 1024).toFixed(2)} KB
- **Gzipped Size**: ${(metrics.gzipSize / 1024).toFixed(2)} KB
- **Component Count**: ${metrics.componentCount}
- **Performance Score**: ${metrics.score}/100

## 🏆 Largest Components
${metrics.largestComponents.map((c) => `- **${c.file}**: ${(c.size / 1024).toFixed(2)} KB (${c.category})`).join("\n")}

## 💡 Recommendations
${metrics.recommendations.map((r) => `- ${r}`).join("\n")}

## 🎯 Optimization Targets
${metrics.largestComponents
  .filter((c) => c.recommendations.length > 0)
  .map(
    (c) => `
### ${c.file}
${c.recommendations.map((r) => `- ${r}`).join("\n")}
`,
  )
  .join("\n")}

---
Generated on: ${new Date().toISOString()}
`

    await fs.writeFile("performance-report.md", report)
    console.log("📄 Performance report generated: performance-report.md")
  }
}

// CLI usage
if (require.main === module) {
  const auditor = new PerformanceAuditor()
  auditor
    .auditProject()
    .then((metrics) => {
      console.log(`\n🎯 Performance Score: ${metrics.score}/100`)
      console.log(`📦 Bundle Size: ${(metrics.totalBundleSize / 1024).toFixed(2)} KB`)
      console.log(`🗜️  Gzipped: ${(metrics.gzipSize / 1024).toFixed(2)} KB`)

      if (metrics.score < 80) {
        console.log("⚠️  Performance improvements needed!")
        process.exit(1)
      } else {
        console.log("✅ Performance looks good!")
      }
    })
    .catch(console.error)
}

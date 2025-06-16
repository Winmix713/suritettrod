import { promises as fs } from "fs"
import path from "path"

interface AccessibilityIssue {
  file: string
  line: number
  severity: "error" | "warning" | "info"
  rule: string
  message: string
  suggestion: string
}

interface AccessibilityReport {
  totalFiles: number
  totalIssues: number
  errors: number
  warnings: number
  score: number
  issues: AccessibilityIssue[]
  recommendations: string[]
}

export class AccessibilityAuditor {
  private readonly ACCESSIBILITY_RULES = {
    // WCAG 2.1 AA compliance rules
    "missing-alt-text": {
      pattern: /<img(?![^>]*alt=)/gi,
      severity: "error" as const,
      message: "Image missing alt attribute",
      suggestion: 'Add descriptive alt text: <img alt="Description" />',
    },
    "missing-aria-label": {
      pattern: /<button(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*>[\s\S]*?[a-zA-Z])/gi,
      severity: "warning" as const,
      message: "Interactive element may need aria-label",
      suggestion: "Add aria-label for screen readers",
    },
    "missing-form-labels": {
      pattern: /<input(?![^>]*aria-label)(?![^>]*aria-labelledby)(?![^>]*id="[^"]*")(?![^>]*type="hidden")/gi,
      severity: "error" as const,
      message: "Form input missing label association",
      suggestion: "Associate with label using id/htmlFor or aria-label",
    },
    "low-contrast-text": {
      pattern: /className="[^"]*text-gray-400[^"]*"/gi,
      severity: "warning" as const,
      message: "Potentially low contrast text",
      suggestion: "Ensure text meets WCAG contrast requirements",
    },
    "missing-focus-styles": {
      pattern: /className="[^"]*focus:(?!outline|ring)/gi,
      severity: "info" as const,
      message: "Consider adding focus styles",
      suggestion: "Add focus:outline or focus:ring classes",
    },
    "missing-semantic-html": {
      pattern: /<div[^>]*role="button"/gi,
      severity: "warning" as const,
      message: "Use semantic HTML instead of div with role",
      suggestion: 'Use <button> element instead of div with role="button"',
    },
    "missing-heading-hierarchy": {
      pattern: /<h[1-6]/gi,
      severity: "info" as const,
      message: "Check heading hierarchy",
      suggestion: "Ensure headings follow logical order (h1 -> h2 -> h3)",
    },
    "missing-skip-links": {
      pattern: /className="[^"]*sr-only[^"]*"/gi,
      severity: "info" as const,
      message: "Good use of screen reader only content",
      suggestion: "Continue using sr-only for accessibility",
    },
  }

  async auditProject(): Promise<AccessibilityReport> {
    console.log("♿ Starting accessibility audit...")

    const issues: AccessibilityIssue[] = []
    let totalFiles = 0

    const auditDirectory = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
          await auditDirectory(fullPath)
        } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx")) {
          totalFiles++
          const fileIssues = await this.auditFile(fullPath)
          issues.push(...fileIssues)
        }
      }
    }

    await auditDirectory(path.join(process.cwd(), "components"))
    await auditDirectory(path.join(process.cwd(), "app"))

    const errors = issues.filter((i) => i.severity === "error").length
    const warnings = issues.filter((i) => i.severity === "warning").length
    const score = this.calculateAccessibilityScore(issues, totalFiles)
    const recommendations = this.generateRecommendations(issues)

    const report: AccessibilityReport = {
      totalFiles,
      totalIssues: issues.length,
      errors,
      warnings,
      score,
      issues: issues.sort((a, b) => {
        const severityOrder = { error: 3, warning: 2, info: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity]
      }),
      recommendations,
    }

    await this.generateReport(report)
    return report
  }

  private async auditFile(filePath: string): Promise<AccessibilityIssue[]> {
    const content = await fs.readFile(filePath, "utf-8")
    const lines = content.split("\n")
    const issues: AccessibilityIssue[] = []
    const relativePath = path.relative(process.cwd(), filePath)

    for (const [ruleName, rule] of Object.entries(this.ACCESSIBILITY_RULES)) {
      let match
      while ((match = rule.pattern.exec(content)) !== null) {
        const lineNumber = content.substring(0, match.index).split("\n").length

        // Skip if it's a positive case (like sr-only)
        if (ruleName === "missing-skip-links") continue

        issues.push({
          file: relativePath,
          line: lineNumber,
          severity: rule.severity,
          rule: ruleName,
          message: rule.message,
          suggestion: rule.suggestion,
        })
      }
    }

    // Additional context-aware checks
    issues.push(...this.performContextualChecks(content, relativePath))

    return issues
  }

  private performContextualChecks(content: string, filePath: string): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = []

    // Check for proper ARIA usage
    const ariaAttributes = content.match(/aria-\w+=/g) || []
    const validAriaAttributes = [
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "aria-expanded",
      "aria-hidden",
      "aria-live",
      "aria-atomic",
      "aria-relevant",
    ]

    ariaAttributes.forEach((attr) => {
      const attrName = attr.replace("=", "")
      if (!validAriaAttributes.includes(attrName)) {
        issues.push({
          file: filePath,
          line: 0,
          severity: "warning",
          rule: "invalid-aria-attribute",
          message: `Invalid ARIA attribute: ${attrName}`,
          suggestion: "Use valid ARIA attributes from ARIA specification",
        })
      }
    })

    // Check for keyboard navigation
    if (content.includes("onClick") && !content.includes("onKeyDown")) {
      issues.push({
        file: filePath,
        line: 0,
        severity: "warning",
        rule: "missing-keyboard-handler",
        message: "Click handler without keyboard support",
        suggestion: "Add onKeyDown handler for keyboard accessibility",
      })
    }

    // Check for color-only information
    if (content.includes("text-red-") || content.includes("text-green-")) {
      issues.push({
        file: filePath,
        line: 0,
        severity: "info",
        rule: "color-only-information",
        message: "Ensure information is not conveyed by color alone",
        suggestion: "Add icons or text to supplement color information",
      })
    }

    return issues
  }

  private calculateAccessibilityScore(issues: AccessibilityIssue[], totalFiles: number): number {
    let score = 100

    // Deduct points based on severity
    const errors = issues.filter((i) => i.severity === "error").length
    const warnings = issues.filter((i) => i.severity === "warning").length
    const infos = issues.filter((i) => i.severity === "info").length

    score -= errors * 10
    score -= warnings * 5
    score -= infos * 1

    // Bonus for good practices
    const goodPractices = issues.filter((i) => i.rule === "missing-skip-links").length
    score += goodPractices * 2

    return Math.max(0, Math.min(100, score))
  }

  private generateRecommendations(issues: AccessibilityIssue[]): string[] {
    const recommendations: string[] = []

    const errorCount = issues.filter((i) => i.severity === "error").length
    const warningCount = issues.filter((i) => i.severity === "warning").length

    if (errorCount > 0) {
      recommendations.push(`Fix ${errorCount} critical accessibility errors`)
    }

    if (warningCount > 0) {
      recommendations.push(`Address ${warningCount} accessibility warnings`)
    }

    // Specific recommendations based on common issues
    const commonIssues = this.getCommonIssues(issues)

    if (commonIssues["missing-alt-text"] > 0) {
      recommendations.push("Add alt text to all images for screen readers")
    }

    if (commonIssues["missing-form-labels"] > 0) {
      recommendations.push("Associate all form inputs with labels")
    }

    if (commonIssues["missing-aria-label"] > 0) {
      recommendations.push("Add ARIA labels to interactive elements")
    }

    // General recommendations
    recommendations.push("Test with screen readers (NVDA, JAWS, VoiceOver)")
    recommendations.push("Verify keyboard navigation works throughout the app")
    recommendations.push("Check color contrast ratios meet WCAG AA standards")
    recommendations.push("Implement focus management for dynamic content")

    return recommendations
  }

  private getCommonIssues(issues: AccessibilityIssue[]): Record<string, number> {
    const counts: Record<string, number> = {}

    issues.forEach((issue) => {
      counts[issue.rule] = (counts[issue.rule] || 0) + 1
    })

    return counts
  }

  private async generateReport(report: AccessibilityReport): Promise<void> {
    const reportContent = `
# Accessibility Audit Report

## 📊 Summary
- **Total Files Audited**: ${report.totalFiles}
- **Total Issues**: ${report.totalIssues}
- **Errors**: ${report.errors}
- **Warnings**: ${report.warnings}
- **Accessibility Score**: ${report.score}/100

## 🚨 Critical Issues (Errors)
${report.issues
  .filter((i) => i.severity === "error")
  .map((i) => `- **${i.file}:${i.line}** - ${i.message}\n  *${i.suggestion}*`)
  .join("\n")}

## ⚠️ Warnings
${report.issues
  .filter((i) => i.severity === "warning")
  .slice(0, 10) // Limit to first 10
  .map((i) => `- **${i.file}:${i.line}** - ${i.message}`)
  .join("\n")}

## 💡 Recommendations
${report.recommendations.map((r) => `- ${r}`).join("\n")}

## 📋 WCAG 2.1 AA Checklist
- [ ] All images have appropriate alt text
- [ ] All form inputs are properly labeled
- [ ] Color contrast meets minimum requirements
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Heading hierarchy is logical
- [ ] ARIA attributes are used correctly
- [ ] Screen reader testing completed

## 🛠️ Tools for Further Testing
- **Automated**: axe-core, Lighthouse accessibility audit
- **Manual**: Screen readers (NVDA, JAWS, VoiceOver)
- **Browser**: Chrome DevTools accessibility panel

---
Generated on: ${new Date().toISOString()}
`

    await fs.writeFile("accessibility-report.md", reportContent)
    console.log("📄 Accessibility report generated: accessibility-report.md")
  }
}

// CLI usage
if (require.main === module) {
  const auditor = new AccessibilityAuditor()
  auditor
    .auditProject()
    .then((report) => {
      console.log(`\n♿ Accessibility Score: ${report.score}/100`)
      console.log(`🚨 Errors: ${report.errors}`)
      console.log(`⚠️  Warnings: ${report.warnings}`)

      if (report.score < 80) {
        console.log("⚠️  Accessibility improvements needed!")
        process.exit(1)
      } else {
        console.log("✅ Accessibility looks good!")
      }
    })
    .catch(console.error)
}

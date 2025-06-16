// Component Audit Script - Hiányzó komponensek feltérképezése

const componentAudit = [
  {
    category: "UI Foundation",
    existing: ["Button", "Card", "Input", "Badge", "Alert", "Skeleton", "Spinner"],
    missing: ["Separator", "ScrollArea", "Tooltip", "Popover"],
    priority: "high",
  },
  {
    category: "Navigation",
    existing: ["Header", "Breadcrumb"],
    missing: ["Pagination", "Sidebar", "Footer", "NavigationMenu"],
    priority: "high",
  },
  {
    category: "Forms",
    existing: ["Input", "Checkbox", "Select", "DatePicker"],
    missing: ["Form", "RadioGroup", "Switch", "Slider"],
    priority: "medium",
  },
  {
    category: "Data Display",
    existing: ["Badge", "Progress", "Table", "Calendar"],
    missing: ["DataTable", "Avatar", "Chart"],
    priority: "medium",
  },
  {
    category: "Feedback",
    existing: ["Alert", "Progress", "Toast", "Spinner"],
    missing: ["EmptyState", "ErrorBoundary", "ConfirmDialog"],
    priority: "high",
  },
  {
    category: "Layout",
    existing: ["Card"],
    missing: ["Container", "Grid", "Stack", "Divider", "AspectRatio"],
    priority: "medium",
  },
  {
    category: "Figma Specific",
    existing: ["FigmaConverter", "ExportWizard", "FigmaPreview", "ComponentLibrary", "LayerTree"],
    missing: ["DesignTokens", "FigmaSync", "VersionControl"],
    priority: "high",
  },
  {
    category: "Export Specific",
    existing: ["ExportWizard", "ExportHistory"],
    missing: ["CodePreview", "FileTree", "DiffViewer", "DownloadManager"],
    priority: "medium",
  },
]

// Prioritás alapú összesítés
const highPriorityMissing = componentAudit
  .filter((audit) => audit.priority === "high")
  .flatMap((audit) => audit.missing)

const mediumPriorityMissing = componentAudit
  .filter((audit) => audit.priority === "medium")
  .flatMap((audit) => audit.missing)

const totalExisting = componentAudit.reduce((sum, audit) => sum + audit.existing.length, 0)
const totalMissing = componentAudit.reduce((sum, audit) => sum + audit.missing.length, 0)

console.log("🎯 COMPONENT AUDIT RESULTS")
console.log("=".repeat(50))
console.log(`✅ Existing Components: ${totalExisting}`)
console.log(`❌ Missing Components: ${totalMissing}`)
console.log(`🔴 HIGH PRIORITY Missing: ${highPriorityMissing.length}`)
console.log(`🟡 MEDIUM PRIORITY Missing: ${mediumPriorityMissing.length}`)

console.log("\n📊 Category Breakdown:")
componentAudit.forEach((audit) => {
  const completionRate = Math.round((audit.existing.length / (audit.existing.length + audit.missing.length)) * 100)
  console.log(
    `${audit.category}: ${completionRate}% complete (${audit.existing.length}/${audit.existing.length + audit.missing.length})`,
  )
})

console.log("\n🔴 HIGH PRIORITY Missing Components:")
highPriorityMissing.forEach((component, index) => {
  console.log(`${index + 1}. ${component}`)
})

console.log("\n🟡 MEDIUM PRIORITY Missing Components:")
mediumPriorityMissing.forEach((component, index) => {
  console.log(`${index + 1}. ${component}`)
})

console.log("\n💡 RECOMMENDATIONS:")
console.log("1. Focus on HIGH PRIORITY components first")
console.log("2. Figma-specific components are mostly complete")
console.log("3. UI Foundation needs Tooltip and Popover")
console.log("4. Navigation components need completion")
console.log("5. Consider using shadcn/ui for missing components")

const overallCompletion = Math.round((totalExisting / (totalExisting + totalMissing)) * 100)
console.log(`\n🏆 OVERALL COMPLETION: ${overallCompletion}%`)

if (overallCompletion >= 80) {
  console.log("🎉 Excellent! Project is nearly complete!")
} else if (overallCompletion >= 60) {
  console.log("👍 Good progress! Focus on high-priority items.")
} else {
  console.log("⚠️ More work needed. Prioritize core components.")
}

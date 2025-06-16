// Component Priority Matrix - Strategic implementation order

export interface ComponentPriority {
  name: string
  category: "ui-foundation" | "navigation" | "feedback" | "figma-specific" | "forms" | "data-display"
  priority: 1 | 2 | 3 | 4 | 5 // 1 = Critical, 5 = Nice to have
  estimatedHours: number
  dependencies: string[]
  businessValue: "high" | "medium" | "low"
  technicalComplexity: "low" | "medium" | "high"
  userImpact: "critical" | "high" | "medium" | "low"
}

export const componentPriorityMatrix: ComponentPriority[] = [
  // CRITICAL - Must have for basic functionality
  {
    name: "Skeleton",
    category: "ui-foundation",
    priority: 1,
    estimatedHours: 2,
    dependencies: [],
    businessValue: "high",
    technicalComplexity: "low",
    userImpact: "high",
  },
  {
    name: "Toast",
    category: "feedback",
    priority: 1,
    estimatedHours: 4,
    dependencies: [],
    businessValue: "high",
    technicalComplexity: "medium",
    userImpact: "critical",
  },
  {
    name: "Spinner",
    category: "feedback",
    priority: 1,
    estimatedHours: 1,
    dependencies: [],
    businessValue: "high",
    technicalComplexity: "low",
    userImpact: "high",
  },
  {
    name: "FigmaPreview",
    category: "figma-specific",
    priority: 1,
    estimatedHours: 8,
    dependencies: [],
    businessValue: "high",
    technicalComplexity: "high",
    userImpact: "critical",
  },

  // HIGH PRIORITY - Important for user experience
  {
    name: "Tooltip",
    category: "ui-foundation",
    priority: 2,
    estimatedHours: 3,
    dependencies: ["Popover"],
    businessValue: "medium",
    technicalComplexity: "medium",
    userImpact: "high",
  },
  {
    name: "Popover",
    category: "ui-foundation",
    priority: 2,
    estimatedHours: 4,
    dependencies: [],
    businessValue: "medium",
    technicalComplexity: "medium",
    userImpact: "high",
  },
  {
    name: "ComponentLibrary",
    category: "figma-specific",
    priority: 2,
    estimatedHours: 6,
    dependencies: ["Card", "Button"],
    businessValue: "high",
    technicalComplexity: "high",
    userImpact: "high",
  },
  {
    name: "LayerTree",
    category: "figma-specific",
    priority: 2,
    estimatedHours: 6,
    dependencies: [],
    businessValue: "high",
    technicalComplexity: "high",
    userImpact: "high",
  },

  // MEDIUM PRIORITY - Nice to have features
  {
    name: "Table",
    category: "data-display",
    priority: 3,
    estimatedHours: 4,
    dependencies: [],
    businessValue: "medium",
    technicalComplexity: "medium",
    userImpact: "medium",
  },
  {
    name: "DatePicker",
    category: "forms",
    priority: 3,
    estimatedHours: 6,
    dependencies: ["Calendar", "Popover"],
    businessValue: "low",
    technicalComplexity: "high",
    userImpact: "medium",
  },
  {
    name: "Breadcrumb",
    category: "navigation",
    priority: 3,
    estimatedHours: 2,
    dependencies: [],
    businessValue: "medium",
    technicalComplexity: "low",
    userImpact: "medium",
  },

  // LOWER PRIORITY - Future enhancements
  {
    name: "Avatar",
    category: "data-display",
    priority: 4,
    estimatedHours: 2,
    dependencies: [],
    businessValue: "low",
    technicalComplexity: "low",
    userImpact: "low",
  },
  {
    name: "Calendar",
    category: "data-display",
    priority: 4,
    estimatedHours: 6,
    dependencies: ["Button"],
    businessValue: "low",
    technicalComplexity: "high",
    userImpact: "medium",
  },
]

// Helper functions for analysis
export const getComponentsByPriority = (priority: number) =>
  componentPriorityMatrix.filter((c) => c.priority === priority)

export const getComponentsByCategory = (category: ComponentPriority["category"]) =>
  componentPriorityMatrix.filter((c) => c.category === category)

export const getTotalEstimatedHours = () => componentPriorityMatrix.reduce((sum, c) => sum + c.estimatedHours, 0)

export const getCriticalPath = () => {
  // Components that block other components
  const dependencies = new Set(componentPriorityMatrix.flatMap((c) => c.dependencies))
  return componentPriorityMatrix.filter((c) => dependencies.has(c.name))
}

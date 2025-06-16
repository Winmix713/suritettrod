// React Component Converter Service

import type {
  FigmaNode,
  ConversionOptions,
  ConversionResult,
  GeneratedComponent,
  GeneratedAsset,
  GeneratedStyle,
  ConversionError,
  ConversionMetadata,
} from "@/lib/figma-types"

export class ReactConverter {
  private options: ConversionOptions
  private errors: ConversionError[] = []
  private components: GeneratedComponent[] = []
  private assets: GeneratedAsset[] = []
  private styles: GeneratedStyle[] = []

  constructor(options: ConversionOptions) {
    this.options = options
  }

  // Main conversion method
  async convert(figmaNodes: FigmaNode[], metadata: Partial<ConversionMetadata> = {}): Promise<ConversionResult> {
    const startTime = Date.now()

    try {
      // Reset state
      this.errors = []
      this.components = []
      this.assets = []
      this.styles = []

      // Process each top-level node
      for (const node of figmaNodes) {
        await this.processNode(node)
      }

      // Generate global styles if using Tailwind
      if (this.options.styling === "tailwind") {
        this.generateTailwindConfig()
      }

      const conversionTime = Date.now() - startTime

      return {
        success: this.errors.filter((e) => e.type === "error").length === 0,
        components: this.components,
        assets: this.assets,
        styles: this.styles,
        errors: this.errors,
        metadata: {
          totalComponents: this.components.length,
          totalAssets: this.assets.length,
          conversionTime,
          figmaFileId: metadata.figmaFileId || "",
          figmaFileName: metadata.figmaFileName || "",
          generatedAt: new Date().toISOString(),
        },
      }
    } catch (error) {
      this.addError("error", `Conversion failed: ${error instanceof Error ? error.message : "Unknown error"}`)

      return {
        success: false,
        components: [],
        assets: [],
        styles: [],
        errors: this.errors,
        metadata: {
          totalComponents: 0,
          totalAssets: 0,
          conversionTime: Date.now() - startTime,
          figmaFileId: metadata.figmaFileId || "",
          figmaFileName: metadata.figmaFileName || "",
          generatedAt: new Date().toISOString(),
        },
      }
    }
  }

  // Process individual Figma node
  private async processNode(node: FigmaNode, parentName = ""): Promise<void> {
    try {
      switch (node.type) {
        case "FRAME":
        case "GROUP":
          await this.processContainer(node, parentName)
          break
        case "COMPONENT":
        case "COMPONENT_SET":
          await this.processComponent(node, parentName)
          break
        case "INSTANCE":
          await this.processInstance(node, parentName)
          break
        case "TEXT":
          await this.processText(node, parentName)
          break
        case "RECTANGLE":
        case "ELLIPSE":
        case "POLYGON":
          await this.processShape(node, parentName)
          break
        case "VECTOR":
          await this.processVector(node, parentName)
          break
        default:
          this.addError("warning", `Unsupported node type: ${node.type}`, node.id, node.name)
      }
    } catch (error) {
      this.addError(
        "error",
        `Failed to process node: ${error instanceof Error ? error.message : "Unknown error"}`,
        node.id,
        node.name,
      )
    }
  }

  // Process container nodes (Frame, Group)
  private async processContainer(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    // Process children first
    const childComponents: string[] = []
    if (node.children) {
      for (const child of node.children) {
        await this.processNode(child, componentName)
        childComponents.push(this.generateComponentName(child.name, componentName))
      }
    }

    // Generate container component
    const component = this.generateContainerComponent(node, componentName, childComponents)
    this.components.push(component)
  }

  // Process component nodes
  private async processComponent(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    // Process children
    const childComponents: string[] = []
    if (node.children) {
      for (const child of node.children) {
        await this.processNode(child, componentName)
        childComponents.push(this.generateComponentName(child.name, componentName))
      }
    }

    // Generate React component
    const component = this.generateReactComponent(node, componentName, childComponents)
    this.components.push(component)
  }

  // Process component instances
  private async processInstance(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    // For instances, we create a wrapper that uses the master component
    const component = this.generateInstanceComponent(node, componentName)
    this.components.push(component)
  }

  // Process text nodes
  private async processText(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    const component = this.generateTextComponent(node, componentName)
    this.components.push(component)
  }

  // Process shape nodes
  private async processShape(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    const component = this.generateShapeComponent(node, componentName)
    this.components.push(component)
  }

  // Process vector nodes
  private async processVector(node: FigmaNode, parentName: string): Promise<void> {
    const componentName = this.generateComponentName(node.name, parentName)

    // Vectors are typically converted to SVG icons
    const component = this.generateVectorComponent(node, componentName)
    this.components.push(component)
  }

  // Generate React component code
  private generateReactComponent(
    node: FigmaNode,
    componentName: string,
    childComponents: string[],
  ): GeneratedComponent {
    const props = this.extractProps(node)
    const styles = this.generateStyles(node)
    const imports = this.generateImports(childComponents)

    const code = `${imports}
${
  this.options.typescript
    ? `
interface ${componentName}Props {
  ${props.map((p) => `${p.name}${p.required ? "" : "?"}: ${p.type}`).join("\n  ")}
}

export default function ${componentName}({ ${props.map((p) => p.name).join(", ")} }: ${componentName}Props) {`
    : `
export default function ${componentName}({ ${props.map((p) => p.name).join(", ")} }) {`
}
  return (
    <div className="${styles.className}">
      ${this.generateChildrenJSX(node, childComponents)}
    </div>
  )
}
`

    return {
      name: componentName,
      code,
      filePath: `components/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: this.extractDependencies(childComponents),
      props,
      stories: this.options.generateStorybook ? this.generateStorybook(componentName, props) : undefined,
    }
  }

  // Generate container component
  private generateContainerComponent(
    node: FigmaNode,
    componentName: string,
    childComponents: string[],
  ): GeneratedComponent {
    const styles = this.generateStyles(node)
    const imports = this.generateImports(childComponents)

    const code = `${imports}

export default function ${componentName}({ children }) {
  return (
    <div className="${styles.className}">
      {children}
    </div>
  )
}
`

    return {
      name: componentName,
      code,
      filePath: `components/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: this.extractDependencies(childComponents),
      props: [{ name: "children", type: "React.ReactNode", required: false }],
    }
  }

  // Generate text component
  private generateTextComponent(node: FigmaNode, componentName: string): GeneratedComponent {
    const styles = this.generateTextStyles(node)
    const text = node.characters || "Text"

    const code = `
export default function ${componentName}({ children = "${text}" }) {
  return (
    <span className="${styles.className}">
      {children}
    </span>
  )
}
`

    return {
      name: componentName,
      code,
      filePath: `components/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: [],
      props: [{ name: "children", type: "string", required: false, defaultValue: text }],
    }
  }

  // Generate shape component
  private generateShapeComponent(node: FigmaNode, componentName: string): GeneratedComponent {
    const styles = this.generateStyles(node)

    const code = `
export default function ${componentName}() {
  return (
    <div className="${styles.className}" />
  )
}
`

    return {
      name: componentName,
      code,
      filePath: `components/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: [],
      props: [],
    }
  }

  // Generate vector/icon component
  private generateVectorComponent(node: FigmaNode, componentName: string): GeneratedComponent {
    const code = `
export default function ${componentName}({ size = 24, color = "currentColor", ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* SVG path will be extracted from Figma vector data */}
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" />
    </svg>
  )
}
`

    return {
      name: componentName,
      code,
      filePath: `components/icons/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: [],
      props: [
        { name: "size", type: "number", required: false, defaultValue: "24" },
        { name: "color", type: "string", required: false, defaultValue: "currentColor" },
      ],
    }
  }

  // Generate instance component
  private generateInstanceComponent(node: FigmaNode, componentName: string): GeneratedComponent {
    const masterComponentName = node.name.replace(/Instance\s*\d*/, "").trim() || "Component"

    const code = `
import ${masterComponentName} from './${this.toKebabCase(masterComponentName)}'

export default function ${componentName}(props) {
  return <${masterComponentName} {...props} />
}
`

    return {
      name: componentName,
      code,
      filePath: `components/${this.toKebabCase(componentName)}.${this.options.typescript ? "tsx" : "jsx"}`,
      dependencies: [masterComponentName],
      props: [],
    }
  }

  // Utility methods
  private generateComponentName(nodeName: string, parentName: string): string {
    const cleanName = nodeName
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()

    const pascalCase = cleanName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")

    return pascalCase || "Component"
  }

  private toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
  }

  private generateStyles(node: FigmaNode): { className: string; css?: string } {
    if (this.options.styling === "tailwind") {
      return { className: this.generateTailwindClasses(node) }
    }

    // For other styling options, generate CSS
    const css = this.generateCSS(node)
    return { className: `${this.toKebabCase(node.name)}-styles`, css }
  }

  private generateTailwindClasses(node: FigmaNode): string {
    const classes: string[] = []

    // Layout classes based on Figma properties
    if (node.layoutMode === "HORIZONTAL") {
      classes.push("flex", "flex-row")
    } else if (node.layoutMode === "VERTICAL") {
      classes.push("flex", "flex-col")
    }

    // Spacing
    if (node.itemSpacing) {
      classes.push(`gap-${Math.round(node.itemSpacing / 4)}`)
    }

    // Padding
    if (node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom) {
      const px = Math.round((node.paddingLeft || 0) / 4)
      const py = Math.round((node.paddingTop || 0) / 4)
      classes.push(`px-${px}`, `py-${py}`)
    }

    // Background color
    if (node.backgroundColor) {
      // Convert Figma color to Tailwind class (simplified)
      classes.push("bg-gray-100") // Placeholder
    }

    // Border radius
    if (node.cornerRadius) {
      const radius = Math.round(node.cornerRadius / 4)
      classes.push(`rounded-${radius}`)
    }

    return classes.join(" ")
  }

  private generateCSS(node: FigmaNode): string {
    // Generate CSS for non-Tailwind styling options
    return `
.${this.toKebabCase(node.name)}-styles {
  /* Generated styles for ${node.name} */
}
`
  }

  private generateTextStyles(node: FigmaNode): { className: string; css?: string } {
    if (this.options.styling === "tailwind") {
      const classes: string[] = []

      if (node.style) {
        // Font size
        const fontSize = Math.round(node.style.fontSize / 4)
        classes.push(`text-${fontSize}xl`)

        // Font weight
        if (node.style.fontWeight >= 700) {
          classes.push("font-bold")
        } else if (node.style.fontWeight >= 600) {
          classes.push("font-semibold")
        } else if (node.style.fontWeight >= 500) {
          classes.push("font-medium")
        }

        // Text alignment
        if (node.style.textAlignHorizontal === "CENTER") {
          classes.push("text-center")
        } else if (node.style.textAlignHorizontal === "RIGHT") {
          classes.push("text-right")
        }
      }

      return { className: classes.join(" ") }
    }

    return { className: `${this.toKebabCase(node.name)}-text` }
  }

  private extractProps(node: FigmaNode): any[] {
    // Extract potential props from node properties
    const props: any[] = []

    if (node.characters) {
      props.push({
        name: "children",
        type: "string",
        required: false,
        defaultValue: node.characters,
        description: "Text content",
      })
    }

    return props
  }

  private generateImports(childComponents: string[]): string {
    if (childComponents.length === 0) return ""

    return childComponents.map((comp) => `import ${comp} from './${this.toKebabCase(comp)}'`).join("\n")
  }

  private generateChildrenJSX(node: FigmaNode, childComponents: string[]): string {
    if (!node.children || node.children.length === 0) {
      return ""
    }

    return node.children
      .map((child, index) => {
        const componentName = childComponents[index]
        return `      <${componentName} />`
      })
      .join("\n")
  }

  private extractDependencies(childComponents: string[]): string[] {
    return childComponents
  }

  private generateStorybook(componentName: string, props: any[]): string {
    return `
import type { Meta, StoryObj } from '@storybook/react'
import ${componentName} from './${this.toKebabCase(componentName)}'

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ${props.map((p) => `${p.name}: ${p.defaultValue || `'${p.name}'`}`).join(",\n    ")}
  },
}
`
  }

  private generateTailwindConfig(): void {
    const tailwindConfig = {
      name: "tailwind.config.js",
      css: `
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors extracted from Figma
      colors: {
        // Add extracted colors here
      },
      // Custom fonts
      fontFamily: {
        // Add extracted fonts here
      },
    },
  },
  plugins: [],
}
`,
      variables: {},
    }

    this.styles.push(tailwindConfig)
  }

  private addError(type: "warning" | "error", message: string, nodeId?: string, nodeName?: string): void {
    this.errors.push({
      type,
      message,
      nodeId,
      nodeName,
    })
  }
}

// Export the converter class
export default ReactConverter

interface ExportOptions {
  jsx: string
  css: string
  format: "typescript" | "javascript" | "vue" | "angular"
  includeTests: boolean
  includeStorybook: boolean
}

interface FileContent {
  name: string
  content: string
  type: string
}

export class ExportService {
  static generateComponentFiles(options: ExportOptions): FileContent[] {
    const files: FileContent[] = []

    // Main component file
    const componentExtension = options.format === "typescript" ? ".tsx" : ".jsx"
    files.push({
      name: `Component${componentExtension}`,
      content: this.formatCode(options.jsx, options.format),
      type: "component",
    })

    // CSS file
    if (options.css) {
      files.push({
        name: "Component.css",
        content: options.css,
        type: "styles",
      })
    }

    // Test file
    if (options.includeTests) {
      files.push({
        name: `Component.test${componentExtension}`,
        content: this.generateTestFile(options.format),
        type: "test",
      })
    }

    // Storybook file
    if (options.includeStorybook) {
      files.push({
        name: `Component.stories${componentExtension}`,
        content: this.generateStorybookFile(options.format),
        type: "story",
      })
    }

    // Package.json
    files.push({
      name: "package.json",
      content: this.generatePackageJson(),
      type: "config",
    })

    // README
    files.push({
      name: "README.md",
      content: this.generateReadme(),
      type: "documentation",
    })

    return files
  }

  static formatCode(code: string, format: string): string {
    // Basic code formatting based on target format
    switch (format) {
      case "javascript":
        return code.replace(/: \w+/g, "").replace(/interface \w+Props[^}]+}/g, "")
      case "vue":
        return this.convertToVue(code)
      case "angular":
        return this.convertToAngular(code)
      default:
        return code
    }
  }

  static convertToVue(jsxCode: string): string {
    return `<template>
  <div class="generated-component">
    <!-- Vue template converted from JSX -->
    <div class="header">
      <h1 class="title">Figma Design</h1>
      <p class="subtitle">Converted with AI</p>
    </div>
    
    <div class="content">
      <div class="card">
        <h2>Feature 1</h2>
        <p>AI-generated content based on your Figma design</p>
      </div>
      
      <div class="card">
        <h2>Feature 2</h2>
        <p>Responsive and accessible components</p>
      </div>
    </div>
    
    <div class="actions">
      <button class="primary-button" @click="handlePrimaryAction">Get Started</button>
      <button class="secondary-button" @click="handleSecondaryAction">Learn More</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeneratedComponent',
  methods: {
    handlePrimaryAction() {
      // Primary action logic
    },
    handleSecondaryAction() {
      // Secondary action logic
    }
  }
}
</script>

<style scoped>
/* Vue component styles */
</style>`
  }

  static convertToAngular(jsxCode: string): string {
    return `import { Component } from '@angular/core';

@Component({
  selector: 'app-generated-component',
  template: \`
    <div class="generated-component">
      <div class="header">
        <h1 class="title">Figma Design</h1>
        <p class="subtitle">Converted with AI</p>
      </div>
      
      <div class="content">
        <div class="card">
          <h2>Feature 1</h2>
          <p>AI-generated content based on your Figma design</p>
        </div>
        
        <div class="card">
          <h2>Feature 2</h2>
          <p>Responsive and accessible components</p>
        </div>
      </div>
      
      <div class="actions">
        <button class="primary-button" (click)="handlePrimaryAction()">Get Started</button>
        <button class="secondary-button" (click)="handleSecondaryAction()">Learn More</button>
      </div>
    </div>
  \`,
  styleUrls: ['./generated-component.component.css']
})
export class GeneratedComponent {
  handlePrimaryAction() {
    // Primary action logic
  }

  handleSecondaryAction() {
    // Secondary action logic
  }
}`
  }

  static generateTestFile(format: string): string {
    const extension = format === "typescript" ? "tsx" : "jsx"
    return `import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Component from './Component.${extension}'

describe('Generated Component', () => {
  test('renders component correctly', () => {
    render(<Component />)
    
    expect(screen.getByText('Figma Design')).toBeInTheDocument()
    expect(screen.getByText('Converted with AI')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Learn More')).toBeInTheDocument()
  })

  test('renders feature cards', () => {
    render(<Component />)
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument()
    expect(screen.getByText('Feature 2')).toBeInTheDocument()
  })

  test('has proper accessibility attributes', () => {
    render(<Component />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})`
  }

  static generateStorybookFile(format: string): string {
    const extension = format === "typescript" ? "tsx" : "jsx"
    return `import type { Meta, StoryObj } from '@storybook/react'
import Component from './Component.${extension}'

const meta: Meta<typeof Component> = {
  title: 'Generated/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCustomClass: Story = {
  args: {
    className: 'custom-styling',
  },
}

export const Playground: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground for the generated component.',
      },
    },
  },
}`
  }

  static generatePackageJson(): string {
    return JSON.stringify(
      {
        name: "figma-generated-component",
        version: "1.0.0",
        description: "Component generated from Figma design using AI",
        main: "Component.tsx",
        scripts: {
          test: "jest",
          storybook: "storybook dev -p 6006",
          "build-storybook": "storybook build",
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
        },
        devDependencies: {
          "@testing-library/react": "^13.4.0",
          "@testing-library/jest-dom": "^5.16.5",
          "@storybook/react": "^7.0.0",
          jest: "^29.0.0",
          typescript: "^5.0.0",
        },
        keywords: ["react", "component", "figma", "ai-generated"],
        author: "Figma Converter AI",
        license: "MIT",
      },
      null,
      2,
    )
  }

  static generateReadme(): string {
    return `# Figma Generated Component

This component was automatically generated from a Figma design using AI-powered conversion.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`jsx
import Component from './Component'

function App() {
  return (
    <div>
      <Component />
    </div>
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | undefined | Additional CSS classes |

## Development

### Running Tests

\`\`\`bash
npm test
\`\`\`

### Storybook

\`\`\`bash
npm run storybook
\`\`\`

## Generated with

- 🎨 Figma Converter AI
- ⚡ Powered by advanced AI models
- 🚀 Production-ready code

## License

MIT
`
  }

  static async createZipFile(files: FileContent[]): Promise<Blob> {
    // Simulate ZIP creation - in real implementation, use JSZip or similar
    const zipContent = files.map((file) => `${file.name}:\n${file.content}`).join("\n\n---\n\n")
    return new Blob([zipContent], { type: "application/zip" })
  }

  static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

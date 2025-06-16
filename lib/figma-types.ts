// Centralized Figma type definitions with proper exports

export interface ConversionOptions {
  framework: "react" | "vue" | "angular" | "svelte"
  styling: "tailwind" | "css-modules" | "styled-components" | "emotion"
  typescript: boolean
  componentStructure: "single-file" | "separate-files"
  exportFormat: "zip" | "github" | "npm"
  includeAssets: boolean
  optimizeImages: boolean
  generateStorybook: boolean
}

export interface FigmaAPIResponse {
  document: FigmaDocument
  components: Record<string, FigmaComponent>
  schemaVersion: number
  styles: Record<string, FigmaStyle>
  name: string
  lastModified: string
  thumbnailUrl: string
  version: string
  role: string
  editorType: string
  linkAccess: string
}

export interface FigmaDocument {
  id: string
  name: string
  type: "DOCUMENT"
  children: FigmaNode[]
}

export interface FigmaNode {
  id: string
  name: string
  type: string
  visible?: boolean
  locked?: boolean
  children?: FigmaNode[]
  backgroundColor?: FigmaColor
  fills?: FigmaFill[]
  strokes?: FigmaStroke[]
  strokeWeight?: number
  strokeAlign?: string
  cornerRadius?: number
  constraints?: FigmaConstraints
  layoutMode?: string
  layoutWrap?: string
  itemSpacing?: number
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  absoluteBoundingBox?: FigmaBoundingBox
  size?: FigmaSize
  relativeTransform?: number[][]
  effects?: FigmaEffect[]
  characters?: string
  style?: FigmaTextStyle
  characterStyleOverrides?: number[]
  styleOverrideTable?: Record<string, FigmaTextStyle>
}

export interface FigmaComponent {
  key: string
  name: string
  description: string
  componentSetId?: string
  documentationLinks: FigmaDocumentationLink[]
}

export interface FigmaStyle {
  key: string
  name: string
  description: string
  styleType: "FILL" | "TEXT" | "EFFECT" | "GRID"
}

export interface FigmaColor {
  r: number
  g: number
  b: number
  a: number
}

export interface FigmaFill {
  type: string
  color?: FigmaColor
  gradientHandlePositions?: FigmaVector[]
  gradientStops?: FigmaGradientStop[]
  scaleMode?: string
  imageTransform?: number[][]
  scalingFactor?: number
  imageRef?: string
}

export interface FigmaStroke {
  type: string
  color?: FigmaColor
}

export interface FigmaConstraints {
  vertical: string
  horizontal: string
}

export interface FigmaBoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface FigmaSize {
  x: number
  y: number
}

export interface FigmaEffect {
  type: string
  visible: boolean
  radius?: number
  color?: FigmaColor
  offset?: FigmaVector
  spread?: number
  showShadowBehindNode?: boolean
}

export interface FigmaTextStyle {
  fontFamily: string
  fontPostScriptName: string
  fontWeight: number
  fontSize: number
  textAlignHorizontal: string
  textAlignVertical: string
  letterSpacing: number
  lineHeightPx: number
  lineHeightPercent: number
  lineHeightUnit: string
}

export interface FigmaVector {
  x: number
  y: number
}

export interface FigmaGradientStop {
  color: FigmaColor
  position: number
}

export interface FigmaDocumentationLink {
  uri: string
}

// Conversion result types
export interface ConversionResult {
  success: boolean
  components: GeneratedComponent[]
  assets: GeneratedAsset[]
  styles: GeneratedStyle[]
  errors: ConversionError[]
  metadata: ConversionMetadata
}

export interface GeneratedComponent {
  name: string
  code: string
  filePath: string
  dependencies: string[]
  props: ComponentProp[]
  stories?: string
}

export interface GeneratedAsset {
  name: string
  url: string
  type: "image" | "icon" | "font"
  optimized: boolean
  size: number
}

export interface GeneratedStyle {
  name: string
  css: string
  variables: Record<string, string>
}

export interface ConversionError {
  type: "warning" | "error"
  message: string
  nodeId?: string
  nodeName?: string
}

export interface ConversionMetadata {
  totalComponents: number
  totalAssets: number
  conversionTime: number
  figmaFileId: string
  figmaFileName: string
  generatedAt: string
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

// API related types
export interface FigmaAPIConfig {
  token: string
  baseUrl: string
  timeout: number
  retryAttempts: number
}

export interface FigmaFileRequest {
  fileId: string
  version?: string
  ids?: string[]
  depth?: number
  geometry?: string
  plugin_data?: string
  branch_data?: boolean
}

export interface FigmaImageRequest {
  fileId: string
  ids: string[]
  scale: number
  format: "jpg" | "png" | "svg" | "pdf"
  svg_include_id?: boolean
  svg_simplify_stroke?: boolean
  use_absolute_bounds?: boolean
  version?: string
}

export interface FigmaImageResponse {
  err?: string
  images: Record<string, string>
  status?: number
}

// Export all types for easy importing
export type {
  ConversionOptions,
  FigmaAPIResponse,
  FigmaDocument,
  FigmaNode,
  FigmaComponent,
  FigmaStyle,
  ConversionResult,
  GeneratedComponent,
  GeneratedAsset,
  GeneratedStyle,
  ConversionError,
  ConversionMetadata,
  ComponentProp,
  FigmaAPIConfig,
  FigmaFileRequest,
  FigmaImageRequest,
  FigmaImageResponse,
}

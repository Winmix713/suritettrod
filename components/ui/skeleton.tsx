import type React from "react"
// Skeleton loading component - Critical UI Foundation component

import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "rectangular" | "text"
  width?: string | number
  height?: string | number
  animation?: "pulse" | "wave" | "none"
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  animation = "pulse",
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = "bg-muted"

  const variantClasses = {
    default: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-none",
    text: "rounded-sm h-4",
  }

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse", // Could be enhanced with custom wave animation
    none: "",
  }

  const inlineStyles = {
    ...style,
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && { height: typeof height === "number" ? `${height}px` : height }),
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], animationClasses[animation], className)}
      style={inlineStyles}
      {...props}
    />
  )
}

// Preset skeleton components for common use cases
export function SkeletonText({ lines = 1, className, ...props }: { lines?: number } & SkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? "75%" : "100%"} {...props} />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 40, className, ...props }: { size?: number } & SkeletonProps) {
  return <Skeleton variant="circular" width={size} height={size} className={className} {...props} />
}

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-[200px] w-full" {...props} />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" {...props} />
        <Skeleton className="h-4 w-[200px]" {...props} />
      </div>
    </div>
  )
}

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
  ...props
}: { rows?: number; cols?: number } & SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" {...props} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 flex-1" {...props} />
          ))}
        </div>
      ))}
    </div>
  )
}

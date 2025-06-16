import type React from "react"
// Spinner loading component - Critical Feedback component

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "dots" | "bars" | "ring"
  color?: "default" | "primary" | "secondary" | "muted"
}

export function Spinner({ className, size = "md", variant = "default", color = "default", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const colorClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  }

  if (variant === "default") {
    return (
      <div className={cn("flex items-center justify-center", className)} {...props}>
        <Loader2 className={cn("animate-spin", sizeClasses[size], colorClasses[color])} />
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)} {...props}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full animate-pulse",
              size === "sm" ? "w-1 h-1" : size === "md" ? "w-2 h-2" : size === "lg" ? "w-3 h-3" : "w-4 h-4",
              colorClasses[color] === "text-foreground"
                ? "bg-foreground"
                : colorClasses[color] === "text-primary"
                  ? "bg-primary"
                  : colorClasses[color] === "text-secondary"
                    ? "bg-secondary"
                    : "bg-muted-foreground",
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.4s",
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "bars") {
    return (
      <div className={cn("flex items-center justify-center space-x-1", className)} {...props}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse",
              size === "sm" ? "w-1 h-4" : size === "md" ? "w-1 h-6" : size === "lg" ? "w-2 h-8" : "w-2 h-12",
              colorClasses[color] === "text-foreground"
                ? "bg-foreground"
                : colorClasses[color] === "text-primary"
                  ? "bg-primary"
                  : colorClasses[color] === "text-secondary"
                    ? "bg-secondary"
                    : "bg-muted-foreground",
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "1.2s",
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === "ring") {
    return (
      <div className={cn("flex items-center justify-center", className)} {...props}>
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-transparent",
            sizeClasses[size],
            colorClasses[color] === "text-foreground"
              ? "border-t-foreground"
              : colorClasses[color] === "text-primary"
                ? "border-t-primary"
                : colorClasses[color] === "text-secondary"
                  ? "border-t-secondary"
                  : "border-t-muted-foreground",
            "border-r-transparent border-b-transparent border-l-transparent",
          )}
          style={{
            borderTopColor: "currentColor",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
          }}
        />
      </div>
    )
  }

  return null
}

// Loading overlay component
export function LoadingOverlay({
  isLoading,
  children,
  className,
  spinnerProps,
  ...props
}: {
  isLoading: boolean
  children: React.ReactNode
  spinnerProps?: SpinnerProps
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Spinner {...spinnerProps} />
        </div>
      )}
    </div>
  )
}

// Inline loading component
export function InlineSpinner({
  text = "Loading...",
  className,
  spinnerProps,
  ...props
}: {
  text?: string
  spinnerProps?: SpinnerProps
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Spinner size="sm" {...spinnerProps} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

"use client"

interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

interface MetricSummary {
  average: number
  count: number
  total: number
  min: number
  max: number
}

class PerformanceMonitorClass {
  private metrics: Map<string, PerformanceMetric[]> = new Map()
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    try {
      // Navigation timing observer
      if ("PerformanceObserver" in window) {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric("navigation", {
              name: entry.name,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              duration: entry.duration,
            })
          }
        })
        navObserver.observe({ entryTypes: ["navigation"] })
        this.observers.push(navObserver)

        // Resource timing observer
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric("resource", {
              name: entry.name,
              startTime: entry.startTime,
              endTime: entry.startTime + entry.duration,
              duration: entry.duration,
            })
          }
        })
        resourceObserver.observe({ entryTypes: ["resource"] })
        this.observers.push(resourceObserver)
      }
    } catch (error) {
      console.warn("Performance monitoring not available:", error)
    }
  }

  startTiming(operation: string): string {
    const id = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const metric: PerformanceMetric = {
      name: operation,
      startTime: performance.now(),
    }

    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    this.metrics.get(operation)!.push(metric)

    return id
  }

  endTiming(operation: string, id?: string): number {
    const endTime = performance.now()
    const operationMetrics = this.metrics.get(operation)

    if (!operationMetrics || operationMetrics.length === 0) {
      return 0
    }

    // Find the most recent unfinished metric for this operation
    const metric = operationMetrics
      .slice()
      .reverse()
      .find((m) => !m.endTime)

    if (metric) {
      metric.endTime = endTime
      metric.duration = endTime - metric.startTime
      return metric.duration
    }

    return 0
  }

  recordMetric(operation: string, metric: PerformanceMetric) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    this.metrics.get(operation)!.push(metric)
  }

  getMetrics(): Record<string, MetricSummary> {
    const summary: Record<string, MetricSummary> = {}

    for (const [operation, metrics] of this.metrics.entries()) {
      const durations = metrics.filter((m) => m.duration !== undefined).map((m) => m.duration!)

      if (durations.length > 0) {
        const total = durations.reduce((sum, d) => sum + d, 0)
        summary[operation] = {
          average: total / durations.length,
          count: durations.length,
          total,
          min: Math.min(...durations),
          max: Math.max(...durations),
        }
      }
    }

    return summary
  }

  clearMetrics() {
    this.metrics.clear()
  }

  destroy() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
    this.clearMetrics()
  }
}

export const PerformanceMonitor = new PerformanceMonitorClass()

// Hook for React components
export function usePerformanceMonitor() {
  const startTiming = (operation: string) => PerformanceMonitor.startTiming(operation)
  const endTiming = (operation: string, id?: string) => PerformanceMonitor.endTiming(operation, id)
  const getMetrics = () => PerformanceMonitor.getMetrics()

  return { startTiming, endTiming, getMetrics }
}

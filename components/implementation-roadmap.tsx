"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Clock, AlertTriangle, Target, TrendingUp } from "lucide-react"
import { componentPriorityMatrix } from "@/lib/component-priority-matrix"

export function ImplementationRoadmap() {
  const [completedComponents, setCompletedComponents] = useState<Set<string>>(new Set())

  const toggleComponent = (name: string) => {
    const newCompleted = new Set(completedComponents)
    if (newCompleted.has(name)) {
      newCompleted.delete(name)
    } else {
      newCompleted.add(name)
    }
    setCompletedComponents(newCompleted)
  }

  const getPhaseComponents = (priority: number) => componentPriorityMatrix.filter((c) => c.priority === priority)

  const getPhaseStats = (priority: number) => {
    const components = getPhaseComponents(priority)
    const completed = components.filter((c) => completedComponents.has(c.name)).length
    const total = components.length
    const totalHours = components.reduce((sum, c) => sum + c.estimatedHours, 0)
    const completedHours = components
      .filter((c) => completedComponents.has(c.name))
      .reduce((sum, c) => sum + c.estimatedHours, 0)

    return { completed, total, totalHours, completedHours, progress: (completed / total) * 100 }
  }

  const overallStats = {
    total: componentPriorityMatrix.length,
    completed: completedComponents.size,
    totalHours: componentPriorityMatrix.reduce((sum, c) => sum + c.estimatedHours, 0),
    completedHours: componentPriorityMatrix
      .filter((c) => completedComponents.has(c.name))
      .reduce((sum, c) => sum + c.estimatedHours, 0),
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return { label: "Critical", color: "bg-red-100 text-red-800 border-red-200" }
      case 2:
        return { label: "High", color: "bg-orange-100 text-orange-800 border-orange-200" }
      case 3:
        return { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      case 4:
        return { label: "Low", color: "bg-green-100 text-green-800 border-green-200" }
      default:
        return { label: "Future", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case "low":
        return <Circle className="w-4 h-4 text-green-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Circle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center space-x-2">
          <Target className="w-8 h-8 text-blue-600" />
          <span>Implementation Roadmap</span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Strategic component development plan based on priority matrix and business value
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Overall Progress</span>
          </CardTitle>
          <CardDescription>
            {overallStats.completed} of {overallStats.total} components completed ({overallStats.completedHours}h of{" "}
            {overallStats.totalHours}h)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(overallStats.completed / overallStats.total) * 100} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{((overallStats.completed / overallStats.total) * 100).toFixed(1)}% Complete</span>
            <span>{overallStats.totalHours - overallStats.completedHours}h Remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Phases */}
      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phases">Development Phases</TabsTrigger>
          <TabsTrigger value="matrix">Priority Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-4">
          {[1, 2, 3, 4].map((priority) => {
            const components = getPhaseComponents(priority)
            const stats = getPhaseStats(priority)
            const { label, color } = getPriorityLabel(priority)

            return (
              <Card key={priority}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={color}>{label} Priority</Badge>
                      <span className="text-lg">Phase {priority}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {stats.completed}/{stats.total} components
                      </Badge>
                      <Badge variant="outline">
                        {stats.completedHours}h/{stats.totalHours}h
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <Progress value={stats.progress} className="h-2 mt-2" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {components.map((component) => (
                      <div
                        key={component.name}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          completedComponents.has(component.name)
                            ? "bg-green-50 border-green-200 shadow-sm"
                            : "hover:bg-muted hover:shadow-sm"
                        }`}
                        onClick={() => toggleComponent(component.name)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-sm">{component.name}</h4>
                          {completedComponents.has(component.name) ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant="secondary">{component.category}</Badge>
                            <span className="text-muted-foreground">{component.estimatedHours}h</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              {getComplexityIcon(component.technicalComplexity)}
                              <span className="text-muted-foreground capitalize">{component.technicalComplexity}</span>
                            </div>
                            <Badge
                              variant={component.userImpact === "critical" ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {component.userImpact}
                            </Badge>
                          </div>

                          {component.dependencies.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-muted-foreground mb-1">Dependencies:</div>
                              <div className="flex flex-wrap gap-1">
                                {component.dependencies.map((dep) => (
                                  <Badge key={dep} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Component Priority Matrix</CardTitle>
              <CardDescription>
                Strategic analysis based on business value, technical complexity, and user impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Component</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Hours</th>
                      <th className="text-left p-2">Business Value</th>
                      <th className="text-left p-2">Complexity</th>
                      <th className="text-left p-2">User Impact</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {componentPriorityMatrix
                      .sort((a, b) => a.priority - b.priority)
                      .map((component) => {
                        const { label, color } = getPriorityLabel(component.priority)
                        return (
                          <tr key={component.name} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{component.name}</td>
                            <td className="p-2">
                              <Badge variant="secondary" className="text-xs">
                                {component.category}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Badge className={`${color} text-xs`}>{label}</Badge>
                            </td>
                            <td className="p-2">{component.estimatedHours}h</td>
                            <td className="p-2">
                              <Badge
                                variant={component.businessValue === "high" ? "default" : "outline"}
                                className="text-xs"
                              >
                                {component.businessValue}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center space-x-1">
                                {getComplexityIcon(component.technicalComplexity)}
                                <span className="capitalize">{component.technicalComplexity}</span>
                              </div>
                            </td>
                            <td className="p-2">
                              <Badge
                                variant={component.userImpact === "critical" ? "destructive" : "outline"}
                                className="text-xs"
                              >
                                {component.userImpact}
                              </Badge>
                            </td>
                            <td className="p-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleComponent(component.name)}
                                className="h-6 w-6 p-0"
                              >
                                {completedComponents.has(component.name) ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

interface WizardStepperProps {
  steps: Step[]
  currentStep: number
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id
        const isCurrent = currentStep === step.id
        const isUpcoming = currentStep < step.id

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                  {
                    "bg-green-500 border-green-500 text-white": isCompleted,
                    "bg-blue-500 border-blue-500 text-white": isCurrent,
                    "bg-gray-100 border-gray-300 text-gray-400": isUpcoming,
                  },
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5 fill-current" />}
              </div>

              {/* Step Info */}
              <div className="mt-2 text-center">
                <p
                  className={cn("text-sm font-medium", {
                    "text-green-600": isCompleted,
                    "text-blue-600": isCurrent,
                    "text-gray-400": isUpcoming,
                  })}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 max-w-20">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn("flex-1 h-0.5 mx-4 transition-all duration-300", {
                  "bg-green-500": currentStep > step.id,
                  "bg-gray-300": currentStep <= step.id,
                })}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

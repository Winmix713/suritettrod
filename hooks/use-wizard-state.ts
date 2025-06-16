"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WizardData {
  figmaUrl: string
  figmaFileId: string
  selectedTemplate: string
  generatedCode: string
  generatedCSS: string
  aiAnalysis: any
  exportSettings: any
}

interface WizardState {
  currentStep: number
  wizardData: WizardData
  setCurrentStep: (step: number) => void
  updateWizardData: (data: Partial<WizardData>) => void
  resetWizard: () => void
}

const initialWizardData: WizardData = {
  figmaUrl: "",
  figmaFileId: "",
  selectedTemplate: "",
  generatedCode: "",
  generatedCSS: "",
  aiAnalysis: null,
  exportSettings: {},
}

export const useWizardState = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      wizardData: initialWizardData,

      setCurrentStep: (step: number) => {
        set({ currentStep: step })
      },

      updateWizardData: (data: Partial<WizardData>) => {
        set((state) => ({
          wizardData: { ...state.wizardData, ...data },
        }))
      },

      resetWizard: () => {
        set({
          currentStep: 1,
          wizardData: initialWizardData,
        })
      },
    }),
    {
      name: "figma-wizard-state",
      partialize: (state) => ({ wizardData: state.wizardData }),
    },
  ),
)

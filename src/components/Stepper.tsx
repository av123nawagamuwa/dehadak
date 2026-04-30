import { Check } from 'lucide-react'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isActive = currentStep === stepNumber

          return (
            <div key={step.label} className="flex flex-1 items-center">
              {/* Step Node */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted || isActive
                      ? 'bg-gold text-white shadow-gold'
                      : 'bg-light-surface border-2 border-light-border text-muted-foreground'
                  } ${isActive ? 'scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                    isActive
                      ? 'text-gold'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 relative">
                  <div className="absolute inset-0 bg-light-border rounded-full" />
                  <div
                    className={`absolute inset-0 bg-gold rounded-full transition-all duration-500 origin-left ${
                      isCompleted ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

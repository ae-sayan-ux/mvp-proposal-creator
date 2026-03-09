"use client";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div
                className={`h-0.5 w-6 sm:w-10 transition-colors ${
                  isDone ? "bg-teal-500" : "bg-gray-200"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => onStepClick(i)}
              className="flex flex-col items-center min-w-[60px] group"
            >
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all
                  ${isActive ? "bg-teal-500 text-white ring-2 ring-teal-300 ring-offset-1" : ""}
                  ${isDone ? "bg-teal-500 text-white" : ""}
                  ${!isActive && !isDone ? "bg-gray-200 text-gray-500 group-hover:bg-gray-300" : ""}
                `}
              >
                {isDone ? "\u2713" : i + 1}
              </div>
              <span
                className={`text-[10px] mt-1 text-center leading-tight transition-colors ${
                  isActive
                    ? "text-teal-600 font-semibold"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

const steps = [
  { id: 1, title: 'Basic Info', description: 'Personal details' },
  { id: 2, title: 'Contact', description: 'Address & phone' },
  { id: 3, title: 'Preferences', description: 'Bio & interests' },
];

export default function Stepper({ currentStep, completedSteps = [] }) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : isCurrent 
                      ? 'border-emerald-600 bg-white text-emerald-600' 
                      : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckIcon className="w-6 h-6" />
                  </motion.div>
                ) : (
                  step.id
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className="mt-3 text-center"
              >
                <p className={`text-sm font-medium ${isCurrent ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </motion.div>

              {index < steps.length - 1 && (
                <div className="absolute top-6 left-6 w-full h-0.5 bg-gray-200 -z-10">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: step.id < currentStep ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-emerald-600"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
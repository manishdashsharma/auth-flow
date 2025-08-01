'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Stepper from '@/components/Stepper';
import Step1Form from '@/components/Step1Form';
import Step2Form from '@/components/Step2Form';
import Step3Form from '@/components/Step3Form';
import { makeAuthenticatedRequest, API_BASE, removeAuthToken } from '@/lib/auth';

export default function ProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepData, setStepData] = useState({
    step1: {},
    step2: {},
    step3: {},
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProfileStatus();
  }, []);

  const loadProfileStatus = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/profile/status`);
      
      if (response.status === 401) {
        removeAuthToken();
        router.push('/signin');
        return;
      }

      const data = await response.json();
      
      if (data.isProfileCreated) {
        router.push('/dashboard');
        return;
      }

      setCurrentStep(data.currentStep || 1);
      
      const completed = [];
      for (let i = 1; i < data.currentStep; i++) {
        completed.push(i);
      }
      setCompletedSteps(completed);

      if (data.profile) {
        setStepData({
          step1: {
            firstName: data.profile.firstName,
            lastName: data.profile.lastName,
            dateOfBirth: data.profile.dateOfBirth,
          },
          step2: {
            phone: data.profile.phone,
            address: data.profile.address,
            city: data.profile.city,
            country: data.profile.country,
          },
          step3: {
            bio: data.profile.bio,
            interests: data.profile.interests,
            profilePicture: data.profile.profilePicture,
          },
        });
      }
    } catch (error) {
      console.error('Error loading profile status:', error);
      setError('Failed to load profile data');
    } finally {
      setInitializing(false);
    }
  };

  const handleStepSubmit = async (stepNumber, formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/profile/step${stepNumber}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        removeAuthToken();
        router.push('/signin');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Step ${stepNumber} submission failed`);
      }

      setStepData(prev => ({
        ...prev,
        [`step${stepNumber}`]: formData,
      }));

      if (!completedSteps.includes(stepNumber)) {
        setCompletedSteps(prev => [...prev, stepNumber]);
      }

      if (data.profile.isProfileCreated) {
        router.push('/dashboard');
      } else {
        setCurrentStep(data.profile.currentStep);
      }
    } catch (error) {
      console.error(`Step ${stepNumber} error:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Complete Your <span className="text-emerald-600">Rightsteps</span> Profile
          </h1>
          <p className="text-lg text-gray-600">
            Just a few more steps to personalize your experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="glass-effect rounded-2xl shadow-xl p-8"
        >
          <Stepper currentStep={currentStep} completedSteps={completedSteps} />

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <Step1Form
                  key="step1"
                  initialData={stepData.step1}
                  onSubmit={(data) => handleStepSubmit(1, data)}
                  loading={loading}
                />
              )}
              {currentStep === 2 && (
                <Step2Form
                  key="step2"
                  initialData={stepData.step2}
                  onSubmit={(data) => handleStepSubmit(2, data)}
                  loading={loading}
                />
              )}
              {currentStep === 3 && (
                <Step3Form
                  key="step3"
                  initialData={stepData.step3}
                  onSubmit={(data) => handleStepSubmit(3, data)}
                  loading={loading}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            You can save your progress and continue later
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
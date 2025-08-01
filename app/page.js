
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (token) {
        try {
          const tokenValue = token.split('=')[1];
          const response = await fetch('/api/profile/status', {
            headers: {
              'Authorization': `Bearer ${tokenValue}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.isProfileCreated) {
              router.push('/dashboard');
            } else {
              router.push('/profile/setup');
            }
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
    };
    
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-emerald-600">Rightsteps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Your journey to success starts here. Create your account and build a personalized profile that grows with you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
            >
              Get Started
            </motion.button>
          </Link>
          
          <Link href="/signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-semibold text-lg hover:bg-emerald-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
            >
              Sign In
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="glass-effect rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Profile</h3>
            <p className="text-gray-600">Build a comprehensive profile in just 3 simple steps</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Goals</h3>
            <p className="text-gray-600">Define your interests and aspirations for personalized experiences</p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Journey</h3>
            <p className="text-gray-600">Access your personalized dashboard and begin your success story</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { makeAuthenticatedRequest, API_BASE, removeAuthToken } from '@/lib/auth';
import { UserIcon, PhoneIcon, MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/profile/status`);
      
      if (response.status === 401) {
        removeAuthToken();
        router.push('/signin');
        return;
      }

      const data = await response.json();
      
      if (!data.isProfileCreated) {
        router.push('/profile/setup');
        return;
      }

      setProfile(data.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    removeAuthToken();
    router.push('/signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to <span className="text-emerald-600">Rightsteps</span>
            </h1>
            <p className="text-lg text-gray-600">
              Hello, {profile?.firstName}! Your profile is complete and ready.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mr-6">
                  {profile?.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-gray-600">Profile Complete</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
                <p className="text-gray-700 leading-relaxed">{profile?.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <PhoneIcon className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{profile?.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <MapPinIcon className="w-5 h-5 text-emerald-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      {profile?.city}, {profile?.country}
                    </p>
                    <p className="text-sm text-gray-500">{profile?.address}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="glass-effect rounded-2xl shadow-xl p-6">
              <div className="flex items-center mb-4">
                <HeartIcon className="w-6 h-6 text-emerald-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile?.interests?.map((interest) => (
                  <motion.span
                    key={interest}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + profile.interests.indexOf(interest) * 0.05 }}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-effect rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                  <p className="font-medium text-emerald-800">Edit Profile</p>
                  <p className="text-sm text-emerald-600">Update your information</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-800">Settings</p>
                  <p className="text-sm text-gray-600">Manage your account</p>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="glass-effect rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              🎉 Congratulations!
            </h3>
            <p className="text-gray-600 mb-6">
              Your profile setup is complete. You&apos;re all set to explore everything Rightsteps has to offer.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Explore Features
              </button>
              <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                View Tutorial
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
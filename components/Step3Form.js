'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

const predefinedInterests = [
  'Technology', 'Travel', 'Photography', 'Music', 'Sports', 'Reading',
  'Cooking', 'Art', 'Gaming', 'Fitness', 'Movies', 'Dancing',
  'Writing', 'Nature', 'Fashion', 'Business', 'Science', 'Learning'
];

export default function Step3Form({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    bio: initialData.bio || '',
    interests: initialData.interests || [],
    profilePicture: initialData.profilePicture || '',
  });

  const [errors, setErrors] = useState({});
  const [customInterest, setCustomInterest] = useState('');

  const validate = () => {
    const newErrors = {};
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters long';
    } else if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addInterest = (interest) => {
    if (!formData.interests.includes(interest)) {
      const updatedInterests = [...formData.interests, interest];
      handleChange('interests', updatedInterests);
    }
  };

  const removeInterest = (interest) => {
    const updatedInterests = formData.interests.filter(i => i !== interest);
    handleChange('interests', updatedInterests);
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      addInterest(customInterest.trim());
      setCustomInterest('');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Preferences</h2>
        <p className="text-gray-600">Tell us about yourself and your interests</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio * <span className="text-gray-500">({formData.bio.length}/500)</span>
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows="4"
          maxLength="500"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none ${
            errors.bio ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Tell us about yourself, your goals, and what makes you unique..."
        />
        {errors.bio && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.bio}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Picture URL (Optional)
        </label>
        <input
          type="url"
          value={formData.profilePicture}
          onChange={(e) => handleChange('profilePicture', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
          placeholder="https://example.com/your-photo.jpg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Interests * <span className="text-gray-500">(Select at least one)</span>
        </label>
        
        {formData.interests.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <motion.span
                  key={interest}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 border border-emerald-200"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-emerald-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {predefinedInterests.map((interest) => (
            <motion.button
              key={interest}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + predefinedInterests.indexOf(interest) * 0.02 }}
              onClick={() => addInterest(interest)}
              disabled={formData.interests.includes(interest)}
              className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                formData.interests.includes(interest)
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              {interest}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            placeholder="Add custom interest..."
          />
          <button
            type="button"
            onClick={addCustomInterest}
            className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add
          </button>
        </div>

        {errors.interests && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 text-sm text-red-600"
          >
            {errors.interests}
          </motion.p>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Completing Profile...
          </div>
        ) : (
          'Complete Profile Setup'
        )}
      </motion.button>
    </motion.form>
  );
}
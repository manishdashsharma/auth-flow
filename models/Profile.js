import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  isProfileCreated: {
    type: Boolean,
    default: false,
  },
  currentStep: {
    type: Number,
    default: 1,
    min: 1,
    max: 3,
  },
  
  // Step 1: Basic Info
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  
  // Step 2: Contact & Location
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  
  // Step 3: Preferences
  bio: {
    type: String,
    maxlength: 500,
  },
  interests: [{
    type: String,
    trim: true,
  }],
  profilePicture: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
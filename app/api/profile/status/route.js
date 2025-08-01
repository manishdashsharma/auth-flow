import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    await dbConnect();
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const profile = await Profile.findOne({ userId: decoded.userId });
    
    if (!profile) {
      return NextResponse.json({
        isProfileCreated: false,
        currentStep: 1,
      });
    }

    return NextResponse.json({
      isProfileCreated: profile.isProfileCreated,
      currentStep: profile.currentStep,
      profile: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        country: profile.country,
        bio: profile.bio,
        interests: profile.interests,
        profilePicture: profile.profilePicture,
      },
    });

  } catch (error) {
    console.error('Profile status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
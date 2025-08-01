import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { verifyToken } from '@/lib/jwt';

export async function POST(request) {
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

    const { bio, interests, profilePicture } = await request.json();

    if (!bio || !interests || interests.length === 0) {
      return NextResponse.json(
        { error: 'Bio and at least one interest are required' },
        { status: 400 }
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: decoded.userId },
      {
        bio,
        interests,
        profilePicture: profilePicture || '',
        isProfileCreated: true,
        currentStep: 3,
      },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile creation completed successfully',
      profile: {
        currentStep: profile.currentStep,
        isProfileCreated: profile.isProfileCreated,
      },
    });

  } catch (error) {
    console.error('Step 3 error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    return NextResponse.json({
      data: {
        bio: profile?.bio || '',
        interests: profile?.interests || [],
        profilePicture: profile?.profilePicture || '',
      },
    });

  } catch (error) {
    console.error('Get step 3 error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
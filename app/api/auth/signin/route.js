import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Profile from '@/models/Profile';
import { signToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const profile = await Profile.findOne({ userId: user._id });

    const token = signToken({ userId: user._id });

    return NextResponse.json({
      message: 'Signin successful',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
      profile: {
        isProfileCreated: profile?.isProfileCreated || false,
        currentStep: profile?.currentStep || 1,
      },
    });

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
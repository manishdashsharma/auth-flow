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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = await User.create({ email, password });

    const profile = await Profile.create({
      userId: user._id,
      isProfileCreated: false,
      currentStep: 1,
    });

    const token = signToken({ userId: user._id });

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
      profile: {
        isProfileCreated: profile.isProfileCreated,
        currentStep: profile.currentStep,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
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

    const { phone, address, city, country } = await request.json();

    if (!phone || !address || !city || !country) {
      return NextResponse.json(
        { error: 'All step 2 fields are required' },
        { status: 400 }
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: decoded.userId },
      {
        phone,
        address,
        city,
        country,
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
      message: 'Step 2 completed successfully',
      profile: {
        currentStep: profile.currentStep,
        isProfileCreated: profile.isProfileCreated,
      },
    });

  } catch (error) {
    console.error('Step 2 error:', error);
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
        phone: profile?.phone || '',
        address: profile?.address || '',
        city: profile?.city || '',
        country: profile?.country || '',
      },
    });

  } catch (error) {
    console.error('Get step 2 error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
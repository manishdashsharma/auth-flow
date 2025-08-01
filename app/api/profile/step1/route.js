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

    const { firstName, lastName, dateOfBirth } = await request.json();

    if (!firstName || !lastName || !dateOfBirth) {
      return NextResponse.json(
        { error: 'All step 1 fields are required' },
        { status: 400 }
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: decoded.userId },
      {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        currentStep: 2,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: 'Step 1 completed successfully',
      profile: {
        currentStep: profile.currentStep,
        isProfileCreated: profile.isProfileCreated,
      },
    });

  } catch (error) {
    console.error('Step 1 error:', error);
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
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        dateOfBirth: profile?.dateOfBirth || '',
      },
    });

  } catch (error) {
    console.error('Get step 1 error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
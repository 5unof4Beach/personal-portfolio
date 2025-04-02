import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Profile from '@/models/Profile';
import { getSession } from '@/lib/auth';

// GET /api/profile - Get profile data
export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne({}).lean();
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update profile data (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get profile data from request
    const profileData = await request.json();
    
    await connectToDatabase();
    
    // Find and update the profile
    const profile = await Profile.findOneAndUpdate(
      {}, // Find the first profile
      { $set: profileData }, // Update with new data
      { new: true, upsert: true } // Return updated document, create if not exists
    );
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 

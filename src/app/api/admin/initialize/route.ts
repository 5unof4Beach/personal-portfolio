import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Profile from '@/models/Profile';

// This is a protected setup route to initialize the admin account
// Only accessible when no admin exists or using a setup key
export async function POST(request: NextRequest) {
  try {
    // Get setup key from environment
    const setupKey = process.env.ADMIN_SETUP_KEY;
    
    // Get data from request
    const data = await request.json();
    const { name, email, password, setupKeyProvided } = data;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    // If admin exists, require setup key
    if (existingAdmin && setupKeyProvided !== setupKey) {
      return NextResponse.json(
        { error: 'Admin user already exists. Setup key required for additional admins.' },
        { status: 403 }
      );
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create the admin user
    const newUser = new User({
      name,
      email,
      password,
      role: 'admin',
    });
    
    await newUser.save();
    
    // Check if a profile exists, if not, create a starter profile
    const existingProfile = await Profile.findOne({});
    if (!existingProfile) {
      const starterProfile = new Profile({
        name,
        title: 'Web Developer',
        about: 'Hello! This is a placeholder for your about section. Edit this in the admin panel.',
        skills: ['HTML', 'CSS', 'JavaScript'],
        social: {
          linkedin: '',
          github: '',
          twitter: '',
          website: '',
        },
        contact: {
          email,
          phone: '',
        },
      });
      
      await starterProfile.save();
    }
    
    return NextResponse.json(
      { success: true, message: 'Admin user and profile created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
} 

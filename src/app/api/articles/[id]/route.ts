import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// GET - Get a single article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const article = await Article.findById(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PATCH - Update an article
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const data = await request.json();
    
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const article = await Article.findByIdAndDelete(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
} 

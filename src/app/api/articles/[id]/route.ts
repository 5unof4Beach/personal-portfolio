import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/helpers/auth';
import mongoose from 'mongoose';

// GET - Get a single article by ID (Adjust selection as needed)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const article = await Article.findById(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PATCH - Update article (handle all fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid article ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Extract all fields from the body
    const data = await request.json(); 
    const { title, content, coverImage, tags, description } = data;

    // Optional: Add validation here if needed (e.g., ensure title is not empty if provided)
    if (title !== undefined && !title) {
       return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }
    if (content !== undefined && (content === null || content === '')) {
       return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    // Prepare update object, only including fields that were actually sent
    const updateData: Partial<typeof data> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    // Allow setting coverImage to null or empty string to remove it
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (tags !== undefined) updateData.tags = tags;
    if (description !== undefined) updateData.description = description;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }
    
    // Update only the provided fields
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: updateData }, 
      // Return the updated document, run schema validators
      { new: true, runValidators: true } // Select all fields by default
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
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content (Consider if still needed)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;
    
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid content ID' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const article = await Article.findByIdAndDelete(id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: `Content ${id} deleted` });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}

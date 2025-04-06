import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/helpers/auth';

// GET - Get all articles (Simplified - remove if no longer needed or adjust selection)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Simplified GET - consider if listing is still needed and what fields to return
    // For now, returning minimal info
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(20) // Example limit
      .select('_id createdAt updatedAt'); // Only select minimal fields
      
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Extract only content from the body
    const { content } = await request.json(); 
    
    // Validate required content field
    if (content === undefined || content === null) { // Check for undefined or null
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    // Create article with only the content field
    const article = await Article.create({ content }); 
    
    // Return the created article (or just success status)
    return NextResponse.json(article, { status: 201 }); 
  } catch (error) {
    console.error('Error creating content:', error);
    // Check for validation errors specifically
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
} 

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/helpers/auth';

// GET - Get all articles (Return necessary fields for preview)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch articles with fields needed for the list page
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(20) // Keep limit or adjust as needed
      .select('title tags coverImage createdAt'); // Select fields for preview
      
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article (handle all fields)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    // Extract all expected fields from the body
    const data = await request.json(); 
    const { title, content, coverImage, tags } = data;
    
    // Validate required fields: title and content
    if (!title || content === undefined || content === null) { 
      return NextResponse.json(
        { error: 'Title and Content are required' },
        { status: 400 }
      );
    }
    
    // Prepare data for creation, including optional fields
    const articleData = { 
      title,
      content,
      coverImage: coverImage || null, // Use null if empty/undefined
      tags: tags || [], // Use empty array if empty/undefined
    };

    const article = await Article.create(articleData); 
    
    return NextResponse.json(article, { status: 201 }); 
  } catch (error) {
    console.error('Error creating article:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
} 

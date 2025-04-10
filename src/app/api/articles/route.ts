import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/helpers/auth';
import { revalidateTag } from 'next/cache';

// GET - Get all articles (Return necessary fields for preview)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch articles with fields needed for the list page
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .select('title description tags coverImage createdAt archived');
    
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
    const { title, content, description, coverImage, tags } = data;
    
    // Validate required fields: title, content, and description
    if (!title || content === undefined || content === null || !description) { 
      return NextResponse.json(
        { error: 'Title, Content, and Description are required' },
        { status: 400 }
      );
    }
    
    // Prepare data for creation, including optional fields
    const articleData = { 
      title,
      content,
      description,
      coverImage: coverImage || null, // Use null if empty/undefined
      tags: tags || [], // Use empty array if empty/undefined
    };

    const article = await Article.create(articleData); 

    revalidateTag("articles-list");
    
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

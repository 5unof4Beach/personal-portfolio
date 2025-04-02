import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Get all articles
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const tag = searchParams.get('tag');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    
    const query = tag ? { tags: tag } : {};
    
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title tags coverImage createdAt');
      
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const article = await Article.create(data);
    
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
} 

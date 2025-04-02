import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Get the current session on the server
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Check if the user is an admin
 */
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === 'admin';
}

/**
 * Protect API routes that require admin access
 */
export async function protectAdminRoute(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return handler(req);
} 

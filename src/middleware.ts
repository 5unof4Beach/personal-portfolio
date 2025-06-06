import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/admin/login' || path === "/admin/setup";
  
  // Check if the path is an admin path
  const isAdminPath = path.startsWith('/admin');
  
  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if trying to access admin route without being authenticated
  if (isAdminPath && !isPublicPath && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Redirect to admin dashboard if already logged in and trying to access login page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Check if user has admin role for admin routes
  if (isAdminPath && !isPublicPath && token && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/admin/:path*'],
}; 

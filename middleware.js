import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public pages
  if (pathname === '/' || pathname === '/signin' || pathname === '/signup') {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get('token');

  // If no token, redirect to signin
  if (!token || !token.value) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Allow authenticated routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
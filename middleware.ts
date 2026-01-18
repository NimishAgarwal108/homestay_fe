import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('🔍 Middleware checking path:', path);

  // ✅ PUBLIC PAGES - Skip auth check (including all auth-related pages)
  const publicPages = [
    '/',
    '/login',
    '/forgotpassword',
    '/verifyotp',
    '/verify-otp',
    '/resetpassword',
    '/reset-password'
  ];

  if (publicPages.includes(path)) {
    console.log('✅ Public page - allowing');
    return NextResponse.next();
  }

  // ✅ PUBLIC API ROUTES - Skip auth check
  if (path.startsWith('/api/auth') || 
      path.startsWith('/api/gallery') || 
      path.startsWith('/api/cloudinary')) {
    console.log('✅ Public API - allowing');
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('adminToken')?.value;
  console.log('🔍 Token exists:', !!token);

  // ✅ Protect admin routes
  const isAdminRoute = path.startsWith('/admin');
  if (isAdminRoute) {
    if (!token) {
      console.log('🔒 Redirecting to login - no token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('✅ Allowing access to admin route');
    return NextResponse.next();
  }

  // Allow everything else
  console.log('✅ Allowing all other routes');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes (/api/*)
     * - Static files (_next/static/*)
     * - Image optimization (_next/image/*)
     * - Favicon and images
     * - Public folder images (hero, food, gallery)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|hero|food|gallery|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)',
  ],
};
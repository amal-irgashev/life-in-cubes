import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/api/auth', '/_next', '/static', '/admin']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Special handling for admin route - redirect to backend
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('http://localhost:8000/admin' + pathname.substring(6) + searchParams.toString()))
  }

  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  
  // Get both access and refresh tokens
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // If we're already on the login page with session_expired error, don't redirect
  if (pathname === '/login' && searchParams.get('error') === 'session_expired') {
    // Clear any existing tokens
    const response = NextResponse.next()
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  // If we have tokens and we're on login/register page, redirect to dashboard
  if ((accessToken || refreshToken) && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If no tokens at all, redirect to login
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    // Only set 'from' parameter if it's not already a login-related path
    if (!pathname.startsWith('/login')) {
      loginUrl.searchParams.set('from', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // If we have tokens, proceed with the request
  const response = NextResponse.next()
  
  // Don't modify headers for API routes
  if (!pathname.startsWith('/api/')) {
    // Ensure cookies are properly set with secure flags
    if (accessToken) {
      response.cookies.set('access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }
    if (refreshToken) {
      response.cookies.set('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 
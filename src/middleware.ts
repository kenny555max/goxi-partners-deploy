import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login', '/register', '/thank-you', '/forgot-password', '/'];

// Protected paths that logged-in users shouldn't access
const restrictedForLoggedInUsers = ['/login', '/register', '/forgot-password', '/'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path is public
    const isPublicPath = publicPaths.some(pp => path === pp || path.startsWith('/api/auth'));

    // Check if the path is restricted for logged-in users
    const isRestrictedForLoggedIn = restrictedForLoggedInUsers.some(rp => path === rp);

    // Get the authentication token from cookies
    const token = request.cookies.get('goxi-auth-token')?.value;

    console.log('Path:', path, 'Token exists:', !!token);

    // If the path is restricted for logged-in users and there's a token, redirect to dashboard
    if (isRestrictedForLoggedIn && token) {
        try {
            // Token exists, redirect to dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (error) {
            // If token verification fails, clear the cookie and continue
            const response = NextResponse.next();
            response.cookies.delete('goxi-auth-token');
            return response;
        }
    }

    // If the path is not public and there's no token, redirect to login
    if (!isPublicPath && !token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('redirect', encodeURIComponent(path));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|assets|api/agents).*)',
    ],
};
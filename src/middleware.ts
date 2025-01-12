import { NextRequest, NextResponse } from 'next/server';

import { AppNavigationRoutes } from './constants';

const privatePaths = [AppNavigationRoutes.MANAGE];

const publicPaths = [AppNavigationRoutes.LOGIN];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isInPrivatePaths = privatePaths.some((path) => pathname.startsWith(path));
    const isInPublicPaths = publicPaths.some((path) => pathname.startsWith(path));

    // If indeed user has not logged in yet
    if (isInPrivatePaths && !refreshToken) {
        return NextResponse.redirect(new URL(AppNavigationRoutes.LOGIN, request.url));
    }

    // If user has logged in already, do NOT allow to access login page
    if (isInPublicPaths && refreshToken) {
        return NextResponse.redirect(new URL(AppNavigationRoutes.DEFAULT, request.url));
    }

    // Logged-in user but access token is expired, while refresh token is still
    if (isInPrivatePaths && !accessToken && refreshToken) {
        const url = new URL(AppNavigationRoutes.REFRESH_TOKEN, request.url);
        url.searchParams.set('refreshToken', refreshToken);
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)', '/manage/:path*', '/login'],
};

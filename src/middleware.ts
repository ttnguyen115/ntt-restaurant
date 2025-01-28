import { NextRequest, NextResponse } from 'next/server';

import { AppNavigationRoutes, Role } from './constants';
import { decodeToken } from './utilities';

const publicPaths = [AppNavigationRoutes.LOGIN];
const guestPaths = [AppNavigationRoutes.GUEST];
const managePaths = [AppNavigationRoutes.MANAGE];
const privatePaths = [...guestPaths, ...managePaths];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    const isInPrivatePaths = privatePaths.some(pathname.startsWith);
    const isInPublicPaths = publicPaths.some(pathname.startsWith);

    // 1. If indeed user has not logged in yet
    if (isInPrivatePaths && !refreshToken) {
        const url = new URL(AppNavigationRoutes.LOGIN, request.url);
        url.searchParams.set('clearTokens', 'true');
        return NextResponse.redirect(url);
    }

    // 2. If user has logged in already
    if (refreshToken) {
        // 2.1 do NOT allow to access login page
        if (isInPublicPaths) {
            return NextResponse.redirect(new URL(AppNavigationRoutes.DEFAULT, request.url));
        }

        // 2.2 Logged-in user but access token is expired, while refresh token is still
        if (isInPrivatePaths && !accessToken) {
            const url = new URL(AppNavigationRoutes.REFRESH_TOKEN, request.url);
            url.searchParams.set('refreshToken', refreshToken);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        // 2.3 Allow to access based on role
        const { role } = decodeToken(refreshToken);
        const isGuestAccessManagePaths = role === Role.Guest && managePaths.some(pathname.startsWith);
        const isAdminAndEmployeeAccessGuestPaths = role !== Role.Guest && guestPaths.some(pathname.startsWith);
        if (isGuestAccessManagePaths || isAdminAndEmployeeAccessGuestPaths) {
            return NextResponse.redirect(new URL(AppNavigationRoutes.DEFAULT, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)', '/manage/:path*', '/login'],
};

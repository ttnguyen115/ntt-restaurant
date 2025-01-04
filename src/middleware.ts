import { NextRequest, NextResponse } from 'next/server';

import { AppNavigationRoutes } from './constants';

const privatePaths = [AppNavigationRoutes.MANAGE];

const publicPaths = [AppNavigationRoutes.LOGIN];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAuth = Boolean(request.cookies.get('accessToken')?.value);

    const isInPrivatePaths = privatePaths.some((path) => pathname.startsWith(path));
    if (isInPrivatePaths && !isAuth) {
        return NextResponse.redirect(new URL(AppNavigationRoutes.LOGIN, request.url));
    }

    const isInPublicPaths = publicPaths.some((path) => pathname.startsWith(path));
    if (isInPublicPaths && isAuth) {
        return NextResponse.redirect(new URL(AppNavigationRoutes.DEFAULT, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)', '/manage/:path*', '/login'],
};

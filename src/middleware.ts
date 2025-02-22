import { NextRequest, NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';
import createMiddleware from 'next-intl/middleware';

import { AppNavigationRoutes, Role } from './constants';
import { defaultLocale, routing } from './lib/i18n';
import type { TokenPayload } from './types';

const transformI18nForPaths = (paths: string[]) => {
    const result: string[] = [];
    paths.forEach((path) => {
        result.push(`/vi${path}`);
        result.push(`/en${path}`);
    });
    return result;
};

const decodeToken = (token: string) => {
    return jwt.decode(token) as TokenPayload;
};

const publicPaths = transformI18nForPaths([AppNavigationRoutes.LOGIN]);
const guestPaths = transformI18nForPaths([AppNavigationRoutes.GUEST]);
const managePaths = transformI18nForPaths([AppNavigationRoutes.MANAGE]);
const ownerOnlyPaths = transformI18nForPaths([AppNavigationRoutes.MANAGE_ACCOUNTS]);
const privatePaths = transformI18nForPaths([...guestPaths, ...managePaths]);

export function middleware(request: NextRequest) {
    const handleI18nRouting = createMiddleware(routing);
    const response = handleI18nRouting(request);

    const { pathname = '', searchParams } = request.nextUrl;

    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale;

    const isInPrivatePaths = privatePaths.some((path) => pathname.startsWith(path));
    const isInPublicPaths = publicPaths.some((path) => pathname.startsWith(path));

    // 1. If indeed user has not logged in yet
    if (isInPrivatePaths && !refreshToken) {
        const url = new URL(`/${locale}${AppNavigationRoutes.LOGIN}`, request.url);
        url.searchParams.set('clearTokens', 'true');
        return NextResponse.redirect(url);
    }

    // 2. If user has logged in already
    if (refreshToken) {
        // 2.1 do NOT allow to access login page
        if (isInPublicPaths) {
            if (searchParams.get('accessToken')) return response;

            return NextResponse.redirect(new URL(`/${locale}${AppNavigationRoutes.DEFAULT}`, request.url));
        }

        // 2.2 Logged-in user but access token is expired, while refresh token is still
        if (isInPrivatePaths && !accessToken) {
            const url = new URL(`/${locale}${AppNavigationRoutes.REFRESH_TOKEN}`, request.url);
            url.searchParams.set('refreshToken', refreshToken);
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        // 2.3 Allow to access based on role
        const { role } = decodeToken(refreshToken);
        const isGuestAccessManagePaths = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path));
        const isAdminAndEmployeeAccessGuestPaths =
            role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path));
        const isEmployeeAndGuestAccessOwnerPaths =
            role !== Role.Owner && ownerOnlyPaths.some((path) => pathname.startsWith(path));

        if (isGuestAccessManagePaths || isAdminAndEmployeeAccessGuestPaths || isEmployeeAndGuestAccessOwnerPaths) {
            return NextResponse.redirect(new URL(`/${locale}${AppNavigationRoutes.DEFAULT}`, request.url));
        }

        return response;
    }

    return response;
}

export const config = {
    matcher: ['/', '/(vi|en)/:path*'],
};

import { NextRequest, NextResponse } from 'next/server';

import _flattenDeep from 'lodash/flattenDeep';
import createMiddleware from 'next-intl/middleware';

import { AppNavigationRoutes, Role } from './constants';
import { routing } from './lib/i18n';
import { decodeToken } from './utilities';

function transformI18nForPaths(paths: string[]) {
    return _flattenDeep(paths.map((path) => [`/vi${path}`, `/en${path}`]));
}

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

    const isInPrivatePaths = privatePaths.some((path) => pathname.startsWith(path));
    const isInPublicPaths = publicPaths.some((path) => pathname.startsWith(path));

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
            if (searchParams.get('accessToken')) return response;

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
        const isGuestAccessManagePaths = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path));
        const isAdminAndEmployeeAccessGuestPaths =
            role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path));
        const isEmployeeAndGuestAccessOwnerPaths =
            role !== Role.Owner && ownerOnlyPaths.some((path) => pathname.startsWith(path));

        if (isGuestAccessManagePaths || isAdminAndEmployeeAccessGuestPaths || isEmployeeAndGuestAccessOwnerPaths) {
            return NextResponse.redirect(new URL(AppNavigationRoutes.DEFAULT, request.url));
        }

        return response;
    }

    return response;
}

export const config = {
    matcher: ['/', '/(vi|en)/:path*'],
};

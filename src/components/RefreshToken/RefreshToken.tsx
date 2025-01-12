'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import {
    decodeAndGetExpirationFromToken,
    getAccessTokenFromLocalStorage,
    getRefreshTokenFromLocalStorage,
    setAccessTokenToLocalStorage,
    setRefreshTokenToLocalStorage,
} from '@/utilities';

import { authApiRequest } from '@/apiRequests';

import { AppNavigationRoutes } from '@/constants';

type IntervalType = string | number | NodeJS.Timeout | undefined;

const TIMEOUT_ONE_SECOND = 1_000;

const UNAUTHENTICATED_PATH = [AppNavigationRoutes.LOGIN, AppNavigationRoutes.LOGOUT, AppNavigationRoutes.REFRESH_TOKEN];

function RefreshToken() {
    const pathname = usePathname();

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return;

        let interval: IntervalType;

        const checkAndRefreshToken = async () => {
            const accessToken = getAccessTokenFromLocalStorage();
            const refreshToken = getRefreshTokenFromLocalStorage();

            if (!accessToken || !refreshToken) return;

            const [decodedAccessToken, decodedRefreshToken] = decodeAndGetExpirationFromToken(
                accessToken,
                refreshToken
            );
            const now = Math.round(new Date().getTime() / 1000);

            // refresh token is expired
            if (decodedRefreshToken.exp <= now) return;

            // Check if it remains 1/3 of the expiration, start to refresh token
            // The remaining time: decodedAccessToken.exp - now
            const expirationTime = decodedAccessToken.exp - decodedAccessToken.iat;
            const remainingTime = decodedAccessToken.exp - now;

            if (remainingTime < expirationTime / 3) {
                try {
                    const { payload } = await authApiRequest.refreshToken();
                    setAccessTokenToLocalStorage(payload.data.accessToken);
                    setRefreshTokenToLocalStorage(payload.data.refreshToken);
                } catch {
                    clearInterval(interval);
                }
            }
        };

        // Run at the first time before setting interval
        (async () => checkAndRefreshToken())();

        interval = setInterval(checkAndRefreshToken, TIMEOUT_ONE_SECOND);

        // I dunno why this line need to mark linter
        // eslint-disable-next-line consistent-return
        return () => {
            clearInterval(interval);
        };
    }, [pathname]);

    return null;
}

export default RefreshToken;

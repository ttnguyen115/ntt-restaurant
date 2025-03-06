'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { getRefreshTokenFromLocalStorage } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { checkAndRefreshToken, useRouter } from '@/lib';

function RefreshTokenPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromUrl = searchParams.get('refreshToken');
    const redirectPath = searchParams.get('redirect');

    useEffect(() => {
        if (refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) {
            checkAndRefreshToken({
                onSuccess: () => {
                    router.push(redirectPath || AppNavigationRoutes.DEFAULT);
                },
            }).then(() => {});
        } else {
            router.push(AppNavigationRoutes.DEFAULT);
        }
    }, [router, refreshTokenFromUrl, redirectPath]);

    return null;
}

export default RefreshTokenPage;

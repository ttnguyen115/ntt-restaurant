'use client';

import { Suspense, useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

import { getRefreshTokenFromLocalStorage } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { checkAndRefreshToken } from '@/lib';

import { useRouter } from '@/lib/i18n';

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

function RefreshTokenWithSuspense() {
    return (
        <Suspense fallback={null}>
            <RefreshTokenPage />
        </Suspense>
    );
}

export default RefreshTokenWithSuspense;

'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { AppNavigationRoutes } from '@/constants';

import { checkAndRefreshToken } from '@/lib';

type IntervalType = string | number | NodeJS.Timeout | undefined;

const TIMEOUT_ONE_SECOND = 1_000;

const UNAUTHENTICATED_PATH = [AppNavigationRoutes.LOGIN, AppNavigationRoutes.LOGOUT, AppNavigationRoutes.REFRESH_TOKEN];

function RefreshToken() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return;

        let interval: IntervalType;

        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval);
                router.push(AppNavigationRoutes.LOGIN);
            },
        });

        interval = setInterval(
            () =>
                checkAndRefreshToken({
                    onError: () => {
                        clearInterval(interval);
                    },
                }),
            TIMEOUT_ONE_SECOND
        );

        // I dunno why this line need to mark linter
        // eslint-disable-next-line consistent-return
        return () => {
            clearInterval(interval);
            router.push(AppNavigationRoutes.LOGIN);
        };
    }, [pathname, router]);

    return null;
}

export default RefreshToken;

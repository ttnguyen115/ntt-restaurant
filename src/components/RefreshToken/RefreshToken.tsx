'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { AppNavigationRoutes } from '@/constants';

import { checkAndRefreshToken, clientSocket } from '@/lib';

type IntervalType = string | number | NodeJS.Timeout | undefined;

const TIMEOUT_ONE_SECOND = 1_000;

const UNAUTHENTICATED_PATH = [AppNavigationRoutes.LOGIN, AppNavigationRoutes.LOGOUT, AppNavigationRoutes.REFRESH_TOKEN];

function RefreshToken() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return;

        let interval: IntervalType;

        function onRefreshToken(force?: boolean) {
            return checkAndRefreshToken({
                onError: () => {
                    clearInterval(interval);
                    router.push(AppNavigationRoutes.LOGIN);
                },
                force,
            });
        }
        onRefreshToken().then(() => {});

        interval = setInterval(onRefreshToken, TIMEOUT_ONE_SECOND);

        function onConnect() {
            console.log('socket from component RefreshToken is connected.');
        }

        function onDisconnect() {
            console.log('socket from component RefreshToken is disconnected.');
        }

        function onRefreshTokenWithSocket() {
            onRefreshToken(true).then(() => {});
        }

        if (clientSocket.connected) onConnect();
        clientSocket.on('refresh-token', onRefreshTokenWithSocket);
        clientSocket.on('connect', onConnect);
        clientSocket.on('disconnect', onDisconnect);

        // I dunno why this line need to mark linter
        // eslint-disable-next-line consistent-return
        return () => {
            clearInterval(interval);
            clientSocket.off('refresh-token', onRefreshTokenWithSocket);
            clientSocket.off('connect', onConnect);
            clientSocket.off('disconnect', onDisconnect);
        };
    }, [pathname, router]);

    return null;
}

export default RefreshToken;

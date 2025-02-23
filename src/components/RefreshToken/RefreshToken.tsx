'use client';

import { use, useEffect } from 'react';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes } from '@/constants';

import { checkAndRefreshToken, usePathname, useRouter } from '@/lib';

type IntervalType = string | number | NodeJS.Timeout | undefined;

const TIMEOUT_ONE_SECOND = 1_000;

const UNAUTHENTICATED_PATH = [AppNavigationRoutes.LOGIN, AppNavigationRoutes.LOGOUT, AppNavigationRoutes.REFRESH_TOKEN];

function RefreshToken() {
    const pathname = usePathname();
    const router = useRouter();

    const { socket, disconnectSocket } = use(AuthContext);

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return;

        let interval: IntervalType;

        function onRefreshToken(force?: boolean) {
            return checkAndRefreshToken({
                onError: () => {
                    clearInterval(interval);
                    disconnectSocket();
                    router.push(AppNavigationRoutes.LOGIN);
                },
                force,
            });
        }

        function onConnect() {
            // eslint-disable-next-line no-console
            console.log('socket from component RefreshToken is connected.');
        }

        function onDisconnect() {
            // eslint-disable-next-line no-console
            console.log('socket from component RefreshToken is disconnected.');
        }

        function onRefreshTokenWithSocket() {
            onRefreshToken(true).then(() => {});
        }

        onRefreshToken().then(() => {});
        interval = setInterval(onRefreshToken, TIMEOUT_ONE_SECOND);

        if (socket?.connected) onConnect();

        socket?.on('refresh-token', onRefreshTokenWithSocket);
        socket?.on('connect', onConnect);
        socket?.on('disconnect', onDisconnect);

        // eslint-disable-next-line consistent-return
        return () => {
            clearInterval(interval);

            socket?.off('refresh-token', onRefreshTokenWithSocket);
            socket?.off('connect', onConnect);
            socket?.off('disconnect', onDisconnect);
        };
    }, [pathname, router, socket, disconnectSocket]);

    return null;
}

export default RefreshToken;

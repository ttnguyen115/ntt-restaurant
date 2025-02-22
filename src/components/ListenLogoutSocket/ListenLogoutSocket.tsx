'use client';

import { memo, use, useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation } from '@/hooks';

import { handleErrorApi } from '@/lib';

const UNAUTHENTICATED_PATH = [AppNavigationRoutes.LOGIN, AppNavigationRoutes.LOGOUT, AppNavigationRoutes.REFRESH_TOKEN];

function ListenLogoutSocket() {
    const pathname = usePathname();
    const router = useRouter();

    const { socket, setRole, disconnectSocket } = use(AuthContext);

    const { mutateAsync: logout, isPending } = useLogoutMutation();

    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return;

        async function onLogout() {
            if (isPending) return;
            try {
                await logout();
                setRole(undefined);
                disconnectSocket();
                router.push(AppNavigationRoutes.DEFAULT);
            } catch (error) {
                handleErrorApi({ error });
            }
        }

        socket?.on('logout', onLogout);

        // eslint-disable-next-line consistent-return
        return () => {
            socket?.off('logout', onLogout);
        };
    }, [isPending, pathname, router, socket, logout, setRole, disconnectSocket]);

    return null;
}

export default memo(ListenLogoutSocket);

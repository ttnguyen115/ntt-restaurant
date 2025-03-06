'use client';

import { use, useEffect, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/utilities';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation } from '@/hooks';

import { useRouter } from '@/lib';

function LogoutPage() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const accessTokenFromUrl = searchParams.get('accessToken');
    const refreshTokenFromUrl = searchParams.get('refreshToken');

    const { socket, disconnectSocket, setRole } = use(AuthContext);

    // use spread operator for preventing infinite loops in useEffect cause re-new object
    const { mutateAsync: logout } = useLogoutMutation();

    // useRef to prevent logout request duplication to server
    const ref = useRef<typeof logout | null>(null);

    useEffect(() => {
        const isAccessTokenValid = accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLocalStorage();
        const isRefreshTokenValid = refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLocalStorage();

        if (!ref.current && (isAccessTokenValid || isRefreshTokenValid)) {
            ref.current = logout;
            logout().then(() => {
                setTimeout(() => {
                    ref.current = null;
                }, 1000);
                setRole(undefined);
                disconnectSocket();
                router.push(AppNavigationRoutes.DEFAULT);
            });
        } else {
            router.push(AppNavigationRoutes.DEFAULT);
        }
    }, [socket, logout, router, accessTokenFromUrl, refreshTokenFromUrl, setRole, disconnectSocket]);

    return null;
}

export default LogoutPage;

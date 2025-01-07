'use client';

import { useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation } from '@/hooks';

function Logout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const accessTokenFromUrl = searchParams.get('accessToken');
    const refreshTokenFromUrl = searchParams.get('refreshToken');

    // use spread operator for preventing infinite loops in useEffect cause re-new object
    const { mutateAsync: logout } = useLogoutMutation();

    // useRef to prevent logout request duplication to server
    const ref = useRef<typeof logout | null>(null);

    useEffect(() => {
        if (
            ref.current ||
            (accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLocalStorage()) ||
            (refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage())
        ) {
            return;
        }
        ref.current = logout;
        logout().then(() => {
            setTimeout(() => {
                ref.current = null;
            }, 1000);
            router.push(AppNavigationRoutes.DEFAULT);
        });
    }, [logout, router, accessTokenFromUrl, refreshTokenFromUrl]);

    return null;
}

export default Logout;

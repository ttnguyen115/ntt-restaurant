'use client';

import { useEffect, useRef } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { getRefreshTokenFromLocalStorage } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation } from '@/hooks';

function Logout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshTokenFromUrl = searchParams.get('refreshToken');

    const { mutateAsync: logout } = useLogoutMutation();

    const ref = useRef<typeof logout | null>(null);

    useEffect(() => {
        if (ref.current || refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) return;
        ref.current = logout;
        logout().then(() => {
            setTimeout(() => {
                ref.current = null;
            }, 1000);
            router.push(AppNavigationRoutes.DEFAULT);
        });
    }, [logout, router, refreshTokenFromUrl]);

    return null;
}

export default Logout;

'use client';

import { memo, useCallback } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { clsx } from 'clsx';

import { AppNavigationRoutes, homeMenuItems } from '@/constants';

import { useAuth, useLogoutMutation } from '@/hooks';

import { handleErrorApi } from '@/lib';

function NavItems({ className }: { className?: string }) {
    const router = useRouter();

    const { role, setRole } = useAuth();

    const { mutateAsync: logout, isPending } = useLogoutMutation();

    const handleLogout = useCallback(async () => {
        if (isPending) return;
        try {
            await logout();
            setRole(undefined);
            router.push(AppNavigationRoutes.DEFAULT);
        } catch (error) {
            handleErrorApi({ error });
        }
    }, [isPending, router, logout, setRole]);

    return (
        <>
            {homeMenuItems.map((item) => {
                const isAuthenticated = item.role && role && item.role.includes(role);
                const canShowLogin =
                    (item.role === undefined && !item.hideWhenLoggedIn) || (!role && item.hideWhenLoggedIn);

                if (isAuthenticated || canShowLogin) {
                    return (
                        <Link
                            href={item.href}
                            key={item.href}
                            className={className}
                        >
                            {item.title}
                        </Link>
                    );
                }

                return null;
            })}
            {role && (
                <div
                    className={clsx(className, 'cursor-pointer')}
                    onClick={handleLogout}
                >
                    Logout
                </div>
            )}
        </>
    );
}

export default memo(NavItems);

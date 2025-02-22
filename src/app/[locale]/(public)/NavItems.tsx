'use client';

import { memo, useCallback } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { clsx } from 'clsx';

import { AppNavigationRoutes, homeMenuItems } from '@/constants';

import { useAuth, useLogoutMutation } from '@/hooks';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { handleErrorApi } from '@/lib';

function NavItems({ className }: { className?: string }) {
    const router = useRouter();

    const { role, setRole, disconnectSocket } = useAuth();

    const { mutateAsync: logout, isPending } = useLogoutMutation();

    const handleLogout = useCallback(async () => {
        if (isPending) return;
        try {
            await logout();
            setRole(undefined);
            disconnectSocket();
            router.push(AppNavigationRoutes.DEFAULT);
        } catch (error) {
            handleErrorApi({ error });
        }
    }, [isPending, router, logout, setRole, disconnectSocket]);

    const renderLogoutDialog = (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className={clsx(className, 'cursor-pointer')}>Logout</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>Log out will DELETE ALL your orders</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

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
            {role && renderLogoutDialog}
        </>
    );
}

export default memo(NavItems);

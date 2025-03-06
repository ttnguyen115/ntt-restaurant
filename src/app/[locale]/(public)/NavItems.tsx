'use client';

import { memo, useCallback } from 'react';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

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

import { handleErrorApi, Link, useRouter } from '@/lib';

function NavItems({ className }: { className?: string }) {
    const router = useRouter();

    const t = useTranslations('NavItem');

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
                <div className={clsx(className, 'cursor-pointer')}>{t('logout')}</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('logoutDialog.logoutQuestion')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('logoutDialog.logoutConfirm')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('logoutDialog.logoutCancel')}</AlertDialogCancel>
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
                            {t(item.title as any)}
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

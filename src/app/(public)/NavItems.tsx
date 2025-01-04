'use client';

import { memo, useEffect, useState } from 'react';

import Link from 'next/link';

import { getAccessTokenFromLocalStorage } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

const menuItems = [
    {
        title: 'Món ăn',
        href: AppNavigationRoutes.MENU,
    },
    {
        title: 'Đơn hàng',
        href: AppNavigationRoutes.ORDERS,
        authRequired: true,
    },
    {
        title: 'Đăng nhập',
        href: AppNavigationRoutes.LOGIN,
        authRequired: false,
    },
    {
        title: 'Quản lý',
        href: AppNavigationRoutes.MANAGE_DASHBOARD,
        authRequired: true,
    },
];

function NavItems({ className }: { className?: string }) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
    }, []);

    return menuItems.map((item) => {
        if ((!item.authRequired && isAuth) || (item.authRequired && !isAuth)) return null;

        return (
            <Link
                href={item.href}
                key={item.href}
                className={className}
            >
                {item.title}
            </Link>
        );
    });
}

export default memo(NavItems);

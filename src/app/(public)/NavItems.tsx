'use client';

import { memo } from 'react';

import Link from 'next/link';

import { AppNavigationRoutes } from '@/constants';

const menuItems = [
    {
        title: 'Món ăn',
        href: AppNavigationRoutes.MENU,
    },
    {
        title: 'Đơn hàng',
        href: AppNavigationRoutes.ORDERS,
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
    return menuItems.map((item) => {
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

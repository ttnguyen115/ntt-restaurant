'use client';

import { memo } from 'react';

import Link from 'next/link';

const menuItems = [
    {
        title: 'Món ăn',
        href: '/menu',
    },
    {
        title: 'Đơn hàng',
        href: '/orders',
    },
    {
        title: 'Đăng nhập',
        href: '/login',
        authRequired: false,
    },
    {
        title: 'Quản lý',
        href: '/manage/dashboard',
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

'use client';

import { memo } from 'react';

import Link from 'next/link';

import { homeMenuItems } from '@/constants';

import { useAuth } from '@/hooks';

function NavItems({ className }: { className?: string }) {
    const { isAuthenticated } = useAuth();

    return homeMenuItems.map((item) => {
        if ((item.authRequired === false && isAuthenticated) || (item.authRequired === true && !isAuthenticated)) {
            return null;
        }

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

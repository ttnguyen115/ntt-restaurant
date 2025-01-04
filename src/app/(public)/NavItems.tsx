'use client';

import { memo, useEffect, useState } from 'react';

import Link from 'next/link';

import { getAccessTokenFromLocalStorage } from '@/utilities';

import { homeMenuItems } from '@/constants';

function NavItems({ className }: { className?: string }) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
    }, []);

    return homeMenuItems.map((item) => {
        if ((item.authRequired === false && isAuth) || (item.authRequired && !isAuth)) return null;

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

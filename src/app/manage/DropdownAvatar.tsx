'use client';

import { memo, useCallback } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation } from '@/hooks';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { handleErrorApi } from '@/lib';

const account = {
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150',
};

function DropdownAvatar() {
    const router = useRouter();

    const { isPending, mutateAsync: logout } = useLogoutMutation();

    const handleLogout = useCallback(async () => {
        if (isPending) return;
        try {
            await logout();
            router.push(AppNavigationRoutes.DEFAULT);
        } catch (error: unknown) {
            handleErrorApi({
                error,
            });
        }
    }, [isPending, logout]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Avatar>
                        <AvatarImage
                            src={account.avatar ?? undefined}
                            alt={account.name}
                        />
                        <AvatarFallback>{account.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href={AppNavigationRoutes.MANAGE_SETTING}
                        className="cursor-pointer"
                    >
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default memo(DropdownAvatar);

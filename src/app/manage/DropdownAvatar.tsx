'use client';

import { memo, use } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes } from '@/constants';

import { useLogoutMutation, useMyAccount } from '@/hooks';

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

function DropdownAvatar() {
    const router = useRouter();

    const { setRole } = use(AuthContext);

    const { isPending, mutateAsync: logout } = useLogoutMutation();

    const { data } = useMyAccount();
    const account = data?.payload.data;

    const handleLogout = async () => {
        if (isPending) return;
        try {
            await logout();
            setRole(undefined);
            router.push(AppNavigationRoutes.DEFAULT);
        } catch (error: unknown) {
            handleErrorApi({
                error,
            });
        }
    };

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
                            src={account?.avatar ?? undefined}
                            alt={account?.name}
                        />
                        <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
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

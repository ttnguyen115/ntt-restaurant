import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from 'lucide-react';

import { RoleType } from '@/types';

import AppNavigationRoutes from './AppNavigationRoutes';
import { Role } from './type';

export const manageMenuItems = [
    {
        title: 'Trang chủ',
        Icon: Home,
        href: AppNavigationRoutes.MANAGE_DASHBOARD,
    },
    {
        title: 'Đơn hàng',
        Icon: ShoppingCart,
        href: AppNavigationRoutes.MANAGE_ORDERS,
    },
    {
        title: 'Bàn ăn',
        Icon: Table,
        href: AppNavigationRoutes.MANAGE_TABLES,
    },
    {
        title: 'Món ăn',
        Icon: Salad,
        href: AppNavigationRoutes.MANAGE_DISHES,
    },
    {
        title: 'Phân tích',
        Icon: LineChart,
        href: AppNavigationRoutes.MANAGE_ANALYTICS,
    },
    {
        title: 'Nhân viên',
        Icon: Users2,
        href: AppNavigationRoutes.MANAGE_ACCOUNTS,
    },
];

export const homeMenuItems: Array<{
    title: string;
    href: string;
    role?: RoleType[] | undefined;
    hideWhenLoggedIn?: boolean | undefined;
}> = [
    {
        title: 'Trang chủ',
        href: AppNavigationRoutes.DEFAULT,
    },
    {
        title: 'Món ăn',
        href: AppNavigationRoutes.GUEST_MENU,
        role: [Role.Guest],
    },
    {
        title: 'Đơn hàng',
        href: AppNavigationRoutes.GUEST_ORDERS,
    },
    {
        title: 'Đăng nhập',
        href: AppNavigationRoutes.LOGIN,
        hideWhenLoggedIn: true,
    },
    {
        title: 'Quản lý',
        href: AppNavigationRoutes.MANAGE_DASHBOARD,
        role: [Role.Owner, Role.Employee],
    },
];

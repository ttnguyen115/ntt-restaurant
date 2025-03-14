import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from 'lucide-react';

import { RoleType } from '@/types';

import AppNavigationRoutes from './AppNavigationRoutes';
import { Role } from './type';

export const manageMenuItems = [
    {
        title: 'Trang chủ',
        Icon: Home,
        href: AppNavigationRoutes.MANAGE_DASHBOARD,
        roles: [Role.Owner, Role.Employee],
    },
    {
        title: 'Đơn hàng',
        Icon: ShoppingCart,
        href: AppNavigationRoutes.MANAGE_ORDERS,
        roles: [Role.Owner, Role.Employee],
    },
    {
        title: 'Bàn ăn',
        Icon: Table,
        href: AppNavigationRoutes.MANAGE_TABLES,
        roles: [Role.Owner, Role.Employee],
    },
    {
        title: 'Món ăn',
        Icon: Salad,
        href: AppNavigationRoutes.MANAGE_DISHES,
        roles: [Role.Owner, Role.Employee],
    },
    {
        title: 'Phân tích',
        Icon: LineChart,
        href: AppNavigationRoutes.MANAGE_ANALYTICS,
        roles: [Role.Owner, Role.Employee],
    },
    {
        title: 'Nhân viên',
        Icon: Users2,
        href: AppNavigationRoutes.MANAGE_ACCOUNTS,
        roles: [Role.Owner],
    },
];

export const homeMenuItems: Array<{
    title: string;
    href: string;
    role?: RoleType[] | undefined;
    hideWhenLoggedIn?: boolean | undefined;
}> = [
    {
        title: 'home',
        href: AppNavigationRoutes.DEFAULT,
    },
    {
        title: 'menu',
        href: AppNavigationRoutes.GUEST_MENU,
        role: [Role.Guest],
    },
    {
        title: 'orders',
        href: AppNavigationRoutes.GUEST_ORDERS,
    },
    {
        title: 'login',
        href: AppNavigationRoutes.LOGIN,
        hideWhenLoggedIn: true,
    },
    {
        title: 'manage',
        href: AppNavigationRoutes.MANAGE_DASHBOARD,
        role: [Role.Owner, Role.Employee],
    },
];

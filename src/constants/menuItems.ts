import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from 'lucide-react';

import AppNavigationRoutes from './AppNavigationRoutes';

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

export const homeMenuItems = [
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

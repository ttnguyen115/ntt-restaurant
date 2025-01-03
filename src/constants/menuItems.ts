import { Home, LineChart, Salad, ShoppingCart, Table, Users2 } from 'lucide-react';

import { AppNavigationRoutes } from '.';

const menuItems = [
    {
        title: 'Dashboard',
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

export default menuItems;

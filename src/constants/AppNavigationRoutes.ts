const PREFIX_MANAGE = '/manage';

const AppNavigationRoutes = {
    LOGIN: '/login',
    LOGOUT: '/logout',

    // main page navigations
    MENU: '/menu',
    ORDERS: '/orders',

    // manage pages
    MANAGE_DASHBOARD: `${PREFIX_MANAGE}/dashboard`,
    MANAGE_ORDERS: `${PREFIX_MANAGE}/orders`,
    MANAGE_TABLES: `${PREFIX_MANAGE}/tables`,
    MANAGE_DISHES: `${PREFIX_MANAGE}/dishes`,
    MANAGE_ANALYTICS: `${PREFIX_MANAGE}/analytics`,
    MANAGE_ACCOUNTS: `${PREFIX_MANAGE}/accounts`,
    MANAGE_GUESTS: `${PREFIX_MANAGE}/guests`,
    MANAGE_SETTING: `${PREFIX_MANAGE}/setting`,
};

export default AppNavigationRoutes;

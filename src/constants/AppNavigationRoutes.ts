const PREFIX_MANAGE = '/manage';
const PREFIX_GUEST = '/guest';

const AppNavigationRoutes = {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/refresh-token',

    // main page navigations
    DEFAULT: '/',
    MENU: '/menu',
    ORDERS: '/orders',
    MANAGE: '/manage',
    GUEST: '/guest',

    // manage pages
    MANAGE_DASHBOARD: `${PREFIX_MANAGE}/dashboard`,
    MANAGE_ORDERS: `${PREFIX_MANAGE}/orders`,
    MANAGE_TABLES: `${PREFIX_MANAGE}/tables`,
    MANAGE_DISHES: `${PREFIX_MANAGE}/dishes`,
    MANAGE_ANALYTICS: `${PREFIX_MANAGE}/analytics`,
    MANAGE_ACCOUNTS: `${PREFIX_MANAGE}/accounts`,
    MANAGE_GUESTS: `${PREFIX_MANAGE}/guests`,
    MANAGE_SETTING: `${PREFIX_MANAGE}/setting`,

    // guest pages
    GUEST_MENU: `${PREFIX_GUEST}/menu`,
};

export default AppNavigationRoutes;

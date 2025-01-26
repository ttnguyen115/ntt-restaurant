import { Prefix, PREFIX_API, Suffix } from '@/constants';

import { http } from '@/lib';

import type {
    GuestCreateOrdersBodyType,
    GuestCreateOrdersResType,
    GuestGetOrdersResType,
    GuestLoginBodyType,
    GuestLoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from '@/schemaValidations';

const ROUTE_HANDLER = {
    LOGIN: PREFIX_API + Prefix.GUEST + Prefix.AUTH + Suffix.LOGIN,
    LOGOUT: PREFIX_API + Prefix.GUEST + Prefix.AUTH + Suffix.LOGOUT,
    REFRESH_TOKEN: PREFIX_API + Prefix.GUEST + Prefix.AUTH + Suffix.REFRESH_TOKEN,
};

const BACKEND_API = {
    LOGIN: Prefix.GUEST + Prefix.AUTH + Suffix.LOGIN,
    LOGOUT: Prefix.GUEST + Prefix.AUTH + Suffix.LOGOUT,
    REFRESH_TOKEN: Prefix.GUEST + Prefix.AUTH + Suffix.REFRESH_TOKEN,
    ORDERS: Prefix.GUEST + '/orders',
};

const guestApiRequest = {
    sLogin: (body: GuestLoginBodyType) => {
        return http.post<GuestLoginResType>(BACKEND_API.LOGIN, body);
    },

    sLogout: (body: LogoutBodyType & { accessToken: string }) => {
        return http.post(
            BACKEND_API.LOGOUT,
            {
                refreshToken: body.refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                },
            }
        );
    },

    sRefreshToken: (body: RefreshTokenBodyType) => {
        return http.post<RefreshTokenResType>(BACKEND_API.REFRESH_TOKEN, body);
    },

    order: (body: GuestCreateOrdersBodyType) => {
        return http.post<GuestCreateOrdersResType>(BACKEND_API.ORDERS, body);
    },

    getOrderList: () => {
        return http.get<GuestGetOrdersResType>(BACKEND_API.ORDERS);
    },

    // route handlers
    login: (body: GuestLoginBodyType) => {
        return http.post<GuestLoginResType>(ROUTE_HANDLER.LOGIN, body, {
            baseUrl: '',
        });
    },

    logout: () => {
        return http.post(ROUTE_HANDLER.LOGOUT, null, { baseUrl: '' });
    },

    refreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType;
    }> | null,

    // this function should use as `Function Declaration` for `this` can access exact this object scope
    async refreshToken() {
        // return if having the same duplicated calling requests
        if (this.refreshTokenRequest) return this.refreshTokenRequest;

        this.refreshTokenRequest = http.post<RefreshTokenResType>(ROUTE_HANDLER.REFRESH_TOKEN, null, {
            baseUrl: '',
        });

        const result = await this.refreshTokenRequest;

        this.refreshTokenRequest = null;

        return result;
    },
};

export default guestApiRequest;

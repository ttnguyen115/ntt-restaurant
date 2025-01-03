// eslint-disable-next-line import/no-cycle
import { ApiRoutes } from '@/constants';

// eslint-disable-next-line import/no-cycle
import { http } from '@/lib';

import {
    GuestCreateOrdersBodyType,
    GuestCreateOrdersResType,
    GuestGetOrdersResType,
    GuestLoginBodyType,
    GuestLoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from '@/schemaValidations';

const guestApiRequest = {
    refreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType;
    }> | null,
    sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>(ApiRoutes.SERVER_API_GUEST_LOGIN, body),

    login: (body: GuestLoginBodyType) =>
        http.post<GuestLoginResType>(ApiRoutes.CLIENT_API_GUEST_LOGIN, body, {
            baseUrl: '',
        }),

    sLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post(
            ApiRoutes.SERVER_API_GUEST_LOGOUT,
            {
                refreshToken: body.refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                },
            }
        ),

    logout: () => http.post(ApiRoutes.CLIENT_API_GUEST_LOGOUT, null, { baseUrl: '' }),

    sRefreshToken: (body: RefreshTokenBodyType) =>
        http.post<RefreshTokenResType>(ApiRoutes.SERVER_API_GUEST_REFRESH_TOKEN, body),

    async refreshToken() {
        if (this.refreshTokenRequest) {
            return this.refreshTokenRequest;
        }
        this.refreshTokenRequest = http.post<RefreshTokenResType>(ApiRoutes.CLIENT_API_GUEST_REFRESH_TOKEN, null, {
            baseUrl: '',
        });
        const result = await this.refreshTokenRequest;
        this.refreshTokenRequest = null;
        return result;
    },

    order: (body: GuestCreateOrdersBodyType) =>
        http.post<GuestCreateOrdersResType>(ApiRoutes.SERVER_API_GUEST_ORDERS, body),

    getOrderList: () => http.get<GuestGetOrdersResType>(ApiRoutes.SERVER_API_GUEST_ORDERS),
};

export default guestApiRequest;

import { Prefix, PREFIX_API, Suffix } from '@/constants';

import { http } from '@/lib';

import type {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from '@/schemaValidations';

export const ROUTE_HANDLER = {
    LOGIN: PREFIX_API + Prefix.AUTH + Suffix.LOGIN,
    LOGOUT: PREFIX_API + Prefix.AUTH + Suffix.LOGOUT,
    REFRESH_TOKEN: PREFIX_API + Prefix.AUTH + Suffix.REFRESH_TOKEN,
};

export const BACKEND_API = {
    LOGIN: Prefix.AUTH + Suffix.LOGIN,
    LOGOUT: Prefix.AUTH + Suffix.LOGOUT,
    REFRESH_TOKEN: Prefix.AUTH + Suffix.REFRESH_TOKEN,
};

const authApiRequest = {
    sLogin: (body: LoginBodyType) => {
        return http.post<LoginResType>(BACKEND_API.LOGIN, body);
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

    // Route handlers
    login: (body: LoginBodyType) => {
        return http.post<LoginResType>(ROUTE_HANDLER.LOGIN, body, {
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

        this.refreshTokenRequest = http.post<RefreshTokenResType>(ROUTE_HANDLER.LOGOUT, null, {
            baseUrl: '',
        });

        const result = await this.refreshTokenRequest;

        this.refreshTokenRequest = null;

        return result;
    },
};

export default authApiRequest;

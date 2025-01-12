import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from '@/schemaValidations';

const authApiRequest = {
    refreshTokenRequest: null as Promise<{
        status: number;
        payload: RefreshTokenResType;
    }> | null,

    sLogin: (body: LoginBodyType) => http.post<LoginResType>(ApiRoutes.SERVER_API_LOGIN, body),

    login: (body: LoginBodyType) =>
        http.post<LoginResType>(ApiRoutes.CLIENT_API_LOGIN, body, {
            baseUrl: '',
        }),

    sLogout: (body: LogoutBodyType & { accessToken: string }) =>
        http.post(
            ApiRoutes.SERVER_API_LOGOUT,
            {
                refreshToken: body.refreshToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`,
                },
            }
        ),

    logout: () => http.post(ApiRoutes.CLIENT_API_LOGOUT, null, { baseUrl: '' }),

    sRefreshToken: (body: RefreshTokenBodyType) =>
        http.post<RefreshTokenResType>(ApiRoutes.SERVER_API_REFRESH_TOKEN, body),

    // this function should use as `Function Declaration` for `this` can access exact this object scope
    async refreshToken() {
        // return if having the same duplicated calling requests
        if (this.refreshTokenRequest) return this.refreshTokenRequest;

        this.refreshTokenRequest = http.post<RefreshTokenResType>(ApiRoutes.CLIENT_API_REFRESH_TOKEN, null, {
            baseUrl: '',
        });

        const result = await this.refreshTokenRequest;

        this.refreshTokenRequest = null;

        return result;
    },
};

export default authApiRequest;

import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import type {
    AccountResType,
    ChangePasswordBodyType,
    ChangePasswordResType,
    UpdateMeBodyType,
} from '@/schemaValidations';

const accountApiRequest = {
    me: () => http.get<AccountResType>(ApiRoutes.ME),

    sMe: (accessToken: string) =>
        http.get<AccountResType>(ApiRoutes.ME, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),

    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(ApiRoutes.ME, body),

    sChangePassword: (accessToken: string, body: ChangePasswordBodyType) =>
        http.put<ChangePasswordResType>(ApiRoutes.SERVER_CHANGE_PASSWORD, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),

    changePassword: (body: ChangePasswordBodyType) =>
        http.put<ChangePasswordResType>(ApiRoutes.CLIENT_CHANGE_PASSWORD, body, {
            baseUrl: '',
        }),
};

export default accountApiRequest;

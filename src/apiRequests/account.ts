import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import type {
    AccountListResType,
    AccountResType,
    ChangePasswordBodyType,
    ChangePasswordResType,
    CreateEmployeeAccountBodyType,
    UpdateEmployeeAccountBodyType,
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
        http.put<ChangePasswordResType>(ApiRoutes.SERVER_API_CHANGE_PASSWORD, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),

    changePassword: (body: ChangePasswordBodyType) =>
        http.put<ChangePasswordResType>(ApiRoutes.CLIENT_API_CHANGE_PASSWORD, body, {
            baseUrl: '',
        }),

    getAllAccounts: () => http.get<AccountListResType>(ApiRoutes.API_ACCOUNTS),

    getEmployee: (id: number) => http.get<AccountResType>(`${ApiRoutes.SERVER_API_ACCOUNT_DETAIL}/${id}`),

    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>(ApiRoutes.API_ACCOUNTS, body),

    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
        http.put<AccountResType>(`${ApiRoutes.SERVER_API_ACCOUNT_DETAIL}/${id}`, body),

    deleteEmployee: (id: number) => http.delete<AccountResType>(`${ApiRoutes.SERVER_API_ACCOUNT_DETAIL}/${id}`),
};

export default accountApiRequest;

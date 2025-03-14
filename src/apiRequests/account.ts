import querystring from 'querystring';

import { Prefix, PREFIX_API, Suffix } from '@/constants';

import { http } from '@/lib';

import type {
    AccountListResType,
    AccountResType,
    ChangePasswordBodyType,
    ChangePasswordResType,
    CreateEmployeeAccountBodyType,
    CreateGuestBodyType,
    CreateGuestResType,
    GetGuestListQueryParamsType,
    GetListGuestsResType,
    UpdateEmployeeAccountBodyType,
    UpdateMeBodyType,
} from '@/schemaValidations';

const ROUTE_HANDLER = {
    CHANGE_PASSWORD: PREFIX_API + Prefix.ACCOUNTS + Suffix.CHANGE_PASSWORD,
};

const BACKEND_API = {
    ACCOUNTS: Prefix.ACCOUNTS,
    ACCOUNT_DETAIL: Prefix.ACCOUNTS + '/detail',
    CHANGE_PASSWORD: Prefix.ACCOUNTS + Suffix.CHANGE_PASSWORD,
    ME: Prefix.ACCOUNTS + Suffix.ME,
    GUESTS: Prefix.ACCOUNTS + '/guests',
};

const accountApiRequest = {
    me: () => http.get<AccountResType>(BACKEND_API.ME),

    sMe: (accessToken: string) => {
        return http.get<AccountResType>(BACKEND_API.ME, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    sChangePassword: (accessToken: string, body: ChangePasswordBodyType) => {
        return http.put<ChangePasswordResType>(BACKEND_API.CHANGE_PASSWORD, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    },

    updateMe: (body: UpdateMeBodyType) => {
        return http.put<AccountResType>(BACKEND_API.ME, body);
    },

    // route handlers
    changePassword: (body: ChangePasswordBodyType) => {
        return http.put<ChangePasswordResType>(ROUTE_HANDLER.CHANGE_PASSWORD, body, {
            baseUrl: '',
        });
    },

    // internal -------------------
    getAllAccounts: () => {
        return http.get<AccountListResType>(BACKEND_API.ACCOUNTS);
    },

    getEmployee: (id: number) => {
        return http.get<AccountResType>(`${BACKEND_API.ACCOUNT_DETAIL}/${id}`);
    },

    addEmployee: (body: CreateEmployeeAccountBodyType) => {
        return http.post<AccountResType>(BACKEND_API.ACCOUNTS, body);
    },

    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => {
        return http.put<AccountResType>(`${BACKEND_API.ACCOUNT_DETAIL}/${id}`, body);
    },

    deleteEmployee: (id: number) => {
        return http.delete<AccountResType>(`${BACKEND_API.ACCOUNT_DETAIL}/${id}`);
    },

    // guest --------------------
    getAllGuests: (query: GetGuestListQueryParamsType) => {
        const queryString = querystring.stringify({
            ...query,
            fromDate: query.fromDate?.toISOString(),
            toDate: query.toDate?.toISOString(),
        });
        return http.get<GetListGuestsResType>(`${BACKEND_API.GUESTS}?${queryString}`);
    },

    createGuest: (body: CreateGuestBodyType) => {
        return http.post<CreateGuestResType>(BACKEND_API.GUESTS, body);
    },
};

export default accountApiRequest;

import Cookies from 'js-cookie';

import envConfig from '@/config';
import {
    getAccessTokenFromLocalStorage,
    isClient,
    removeTokensFromLocalStorage,
    setAccessTokenToLocalStorage,
    setRefreshTokenToLocalStorage,
} from '@/utilities';

import { AUTH_ROUTE_HANDLER, GUEST_ROUTE_HANDLER } from '@/apiRequests';

import { AppNavigationRoutes } from '@/constants';

import { LoginResType } from '@/schemaValidations';

import { defaultLocale, redirect } from '..';

import { EntityError, EntityErrorPayload } from './EntityError';
import { HttpError } from './HttpError';
import { AUTHENTICATION_ERROR_STATUS, ENTITY_ERROR_STATUS } from './StatusCode';

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined;
};

let clientLogoutRequest: null | Promise<unknown> = null;

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    options?: CustomOptions | undefined
) => {
    let body: FormData | string | undefined;

    if (options?.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }

    const baseHeaders: {
        [key: string]: string;
    } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

    if (isClient) {
        const accessToken = getAccessTokenFromLocalStorage();
        if (accessToken) {
            baseHeaders.Authorization = `Bearer ${accessToken}`;
        }
    }

    // envConfig.NEXT_PUBLIC_API_ENDPOINT as default if having no baseUrl in `options` param
    // if `options.baseUrl === ''` => call API to Next.js Server
    const baseUrl = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl;
    const fullUrl = `${baseUrl}${url}`;
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as any,
        body,
        method,
    });
    const payload: Response = await res.json();
    const data = {
        status: res.status,
        payload,
    };

    // Interceptors
    if (!res.ok) {
        if (res.status === ENTITY_ERROR_STATUS) {
            throw new EntityError(
                data as {
                    status: 422;
                    payload: EntityErrorPayload;
                }
            );
        } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
            if (isClient) {
                if (!clientLogoutRequest) {
                    clientLogoutRequest = fetch(AUTH_ROUTE_HANDLER.LOGOUT, {
                        method: 'POST',
                        body: null, // temporarily always be success (ex: session is expired...)
                        headers: {
                            ...baseHeaders,
                        },
                    });

                    try {
                        await clientLogoutRequest;
                    } finally {
                        removeTokensFromLocalStorage();
                        clientLogoutRequest = null;

                        /* IMPORTANT:
                         * Redirect to /login could be lead to infinite loops
                         * In login page, there are APIs relating to accessToken
                         * If accessToken is missed, the request can reach here
                         */
                        window.location.href = AppNavigationRoutes.LOGIN;
                    }
                }
            } else {
                // API calling from Next.js (Route handlers, Server Components) to backend
                // access token is still valid
                const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1];
                const locale = Cookies.get('NEXT_LOCALE');

                redirect({
                    href: `${AppNavigationRoutes.LOGIN}?accessToken=${accessToken}`,
                    locale: locale ?? defaultLocale,
                });
            }
        } else {
            throw new HttpError(data);
        }
    }

    // LocalStorage handling
    if (isClient) {
        if ([AUTH_ROUTE_HANDLER.LOGIN, GUEST_ROUTE_HANDLER.LOGIN].includes(url)) {
            const { accessToken, refreshToken } = (payload as LoginResType).data;
            setAccessTokenToLocalStorage(accessToken);
            setRefreshTokenToLocalStorage(refreshToken);
        } else if ([AUTH_ROUTE_HANDLER.LOGOUT, GUEST_ROUTE_HANDLER.LOGOUT].includes(url)) {
            removeTokensFromLocalStorage();
        }
    }

    return data;
};

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('GET', url, options);
    },
    post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('POST', url, { ...options, body });
    },
    put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('PUT', url, { ...options, body });
    },
    delete<Response>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
        return request<Response>('DELETE', url, { ...options });
    },
};

export default http;

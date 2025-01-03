import { redirect } from 'next/navigation';

import envConfig from '@/config';
import { isClient } from '@/utilities';

import { ApiRoutes, AppNavigationRoutes } from '@/constants';

import { LoginResType } from '@/schemaValidations';

import { EntityError, EntityErrorPayload } from './EntityError';
import { HttpError } from './HttpError';
import { AUTHENTICATION_ERROR_STATUS, ENTITY_ERROR_STATUS } from './StatusCode';

type CustomOptions = Omit<RequestInit, 'method'> & {
    baseUrl?: string | undefined;
};

let clientLogoutRequest: null | Promise<any> = null;

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
        const accessToken = localStorage.getItem('accessToken');
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
                    clientLogoutRequest = fetch(ApiRoutes.CLIENT_API_LOGOUT, {
                        method: 'POST',
                        body: null,
                        headers: {
                            ...baseHeaders,
                        },
                    });
                    try {
                        await clientLogoutRequest;
                    } finally {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        clientLogoutRequest = null;
                        // eslint-disable-next-line no-restricted-globals
                        location.href = AppNavigationRoutes.LOGIN;
                    }
                }
            } else {
                const accessToken = (options?.headers as any)?.Authorization.split('Bearer ')[1];
                redirect(`${AppNavigationRoutes.LOGOUT}?accessToken=${accessToken}`);
            }
        } else {
            throw new HttpError(data);
        }
    }

    if (isClient) {
        if (url === ApiRoutes.CLIENT_API_LOGIN) {
            const { accessToken, refreshToken } = (payload as LoginResType).data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        } else if (url === ApiRoutes.CLIENT_API_LOGOUT) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
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

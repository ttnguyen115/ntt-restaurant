import isClient from './isClient';

export const getAccessTokenFromLocalStorage = () => (isClient ? localStorage.getItem('accessToken') : null);

export const getRefreshTokenFromLocalStorage = () => (isClient ? localStorage.getItem('refreshToken') : null);

export const setAccessTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('accessToken', value);

export const setRefreshTokenToLocalStorage = (value: string) => isClient && localStorage.setItem('refreshToken', value);

export const removeTokensFromLocalStorage = () => {
    if (isClient) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

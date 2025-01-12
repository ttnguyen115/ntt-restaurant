'use client';

import { createContext, useEffect, useState } from 'react';

import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/utilities';

import type { ChildrenObject } from '@/types';

interface IAuthContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuth: boolean) => void;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
});

function AuthProvider({ children }: ChildrenObject) {
    const [isAuthenticated, setIsAuth] = useState(false);

    const setIsAuthenticated = (isAuth: boolean) => {
        if (isAuth) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
            removeTokensFromLocalStorage();
        }
    };

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage();
        if (accessToken) setIsAuth(true);
    }, []);

    return <AuthContext value={{ isAuthenticated, setIsAuthenticated }}>{children}</AuthContext>;
}

export default AuthProvider;

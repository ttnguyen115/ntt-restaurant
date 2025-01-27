'use client';

import { createContext, useEffect, useState } from 'react';

import { decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/utilities';

import type { ChildrenObject, RoleType } from '@/types';

interface IAuthContext {
    isAuthenticated: boolean;
    role: RoleType | undefined;
    setRole: (role?: RoleType | undefined) => void;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    role: undefined,
    setRole: () => {},
});

function AuthProvider({ children }: ChildrenObject) {
    const [role, setRoleState] = useState<RoleType | undefined>();

    const isAuthenticated = Boolean(role);

    const setRole = (_role?: RoleType | undefined) => {
        setRoleState(_role);
        if (!_role) removeTokensFromLocalStorage();
    };

    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage();
        if (accessToken) {
            const decodedToken = decodeToken(accessToken);
            setRoleState(decodedToken.role);
        }
    }, []);

    return <AuthContext value={{ isAuthenticated, role, setRole }}>{children}</AuthContext>;
}

export default AuthProvider;

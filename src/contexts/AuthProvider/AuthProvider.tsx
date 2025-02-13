'use client';

import { createContext, useCallback, useEffect, useRef, useState } from 'react';

import type { Socket } from 'socket.io-client';

import {
    decodeToken,
    getAccessTokenFromLocalStorage,
    initSocketInstance,
    removeTokensFromLocalStorage,
} from '@/utilities';

import type { ChildrenObject, RoleType } from '@/types';

interface IAuthContext {
    isAuthenticated: boolean;
    role: RoleType | undefined;
    socket: Socket | undefined;
    setRole: (role?: RoleType | undefined) => void;
    setSocket: (socket?: Socket | undefined) => void;
    disconnectSocket: () => void;
}

export const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    role: undefined,
    socket: undefined as Socket | undefined,
    setRole: () => {},
    setSocket: () => {},
    disconnectSocket: () => {},
});

function AuthProvider({ children }: ChildrenObject) {
    const [role, setRoleState] = useState<RoleType | undefined>();
    const [socket, setSocket] = useState<Socket | undefined>();

    const isAuthenticated = Boolean(role);

    // prevent socket will disconnect and reconnect in Strict Mode
    const socketRef = useRef(0);

    const setRole = (_role?: RoleType | undefined) => {
        setRoleState(_role);
        if (!_role) removeTokensFromLocalStorage();
    };

    const disconnectSocket = useCallback(() => {
        socket?.disconnect();
        setSocket(undefined);
    }, [socket, setSocket]);

    useEffect(() => {
        if (!socketRef.current) {
            const accessToken = getAccessTokenFromLocalStorage();
            if (accessToken) {
                const decodedToken = decodeToken(accessToken);
                setRoleState(decodedToken.role);
                setSocket(initSocketInstance(accessToken));
            }
            socketRef.current += 1;
        }
    }, []);

    return (
        <AuthContext value={{ isAuthenticated, role, socket, setSocket, setRole, disconnectSocket }}>
            {children}
        </AuthContext>
    );
}

export default AuthProvider;

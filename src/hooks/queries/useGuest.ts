import { useMutation } from '@tanstack/react-query';

import { guestApiRequest } from '@/apiRequests';

export const useGuestLogin = () => {
    return useMutation({
        mutationFn: guestApiRequest.login,
    });
};

export const useGuestLogout = () => {
    return useMutation({
        mutationFn: guestApiRequest.logout,
    });
};

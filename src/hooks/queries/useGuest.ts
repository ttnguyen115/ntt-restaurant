import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useUpdateGuestOrder = () => {
    return useMutation({
        mutationFn: guestApiRequest.order,
    });
};

export const useGetGuestOrders = () => {
    return useQuery({
        queryFn: guestApiRequest.getOrderList,
        queryKey: ['guest-orders'],
    });
};

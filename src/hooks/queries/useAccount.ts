import { useMutation, useQuery } from '@tanstack/react-query';

import { accountApiRequest } from '@/apiRequests';

export const useMyAccount = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me,
    });
};

export const useMyAccountMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe,
    });
};

export const useMyPasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword,
    });
};

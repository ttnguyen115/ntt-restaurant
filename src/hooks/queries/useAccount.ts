import { useQuery } from '@tanstack/react-query';

import { accountApiRequest } from '@/apiRequests';

export const useAccountProfile = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me,
    });
};

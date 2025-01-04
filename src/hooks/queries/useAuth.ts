import { useMutation } from '@tanstack/react-query';

import { authApiRequest } from '@/apiRequests';

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: authApiRequest.login,
    });
};

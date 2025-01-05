import { useMutation } from '@tanstack/react-query';

import { mediaApiRequest } from '@/apiRequests';

export const useMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload,
    });
};

import { UseFormSetError } from 'react-hook-form';

import { toast } from '@/components/ui/use-toast';

import { EntityError } from '@/lib';

const handleErrorApi = ({
    error,
    setError,
    duration,
}: {
    error: any;
    setError?: UseFormSetError<any>;
    duration?: number;
}) => {
    if (error instanceof EntityError && setError) {
        error.payload.errors.forEach((item) => {
            setError(item.field, {
                type: 'server',
                message: item.message,
            });
        });
    } else {
        toast({
            title: 'Lỗi',
            description: error?.payload?.message ?? 'Lỗi không xác định',
            variant: 'destructive',
            duration: duration ?? 5000,
        });
    }
};

export default handleErrorApi;

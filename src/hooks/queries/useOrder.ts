import { useMutation, useQuery } from '@tanstack/react-query';

import { orderApiRequest } from '@/apiRequests';

import { UpdateOrderBodyType } from '@/schemaValidations';

export const useUpdateOrder = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) =>
            orderApiRequest.updateOrder(orderId, body),
    });
};

export const useGetAllOrders = () => {
    return useQuery({
        queryFn: orderApiRequest.orders,
        queryKey: ['orders'],
    });
};

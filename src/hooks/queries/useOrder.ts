import { useMutation, useQuery } from '@tanstack/react-query';

import { orderApiRequest } from '@/apiRequests';

import type { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations';

export const useGetAllOrders = (query: GetOrdersQueryParamsType) => {
    return useQuery({
        queryFn: () => orderApiRequest.getOrders(query),
        queryKey: ['orders', query],
    });
};

export const useGetOrderDetail = (id: number, enabled: boolean) => {
    return useQuery({
        queryFn: () => orderApiRequest.getOrderDetail(id),
        queryKey: ['orders', id],
        enabled,
    });
};

export const useUpdateOrder = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & { orderId: number }) =>
            orderApiRequest.updateOrder(orderId, body),
    });
};

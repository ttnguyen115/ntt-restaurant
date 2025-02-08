import { useMutation, useQuery } from '@tanstack/react-query';

import { orderApiRequest } from '@/apiRequests';

import type { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations';

export const useGetAllOrders = (query: GetOrdersQueryParamsType) => {
    return useQuery({
        queryFn: () => orderApiRequest.getOrders(query),
        queryKey: ['orders', query],
    });
};

export const useGetOrderDetail = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryFn: () => orderApiRequest.getOrderDetail(id),
        queryKey: ['orders', id],
        enabled,
    });
};

type UseUpdateOrderBodyType = UpdateOrderBodyType & { orderId: number };

export const useUpdateOrder = () => {
    return useMutation({
        mutationFn: ({ orderId, ...body }: UseUpdateOrderBodyType) => orderApiRequest.updateOrder(orderId, body),
    });
};

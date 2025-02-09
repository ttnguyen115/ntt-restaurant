import querystring from 'querystring';

import { http } from '@/lib';

import type {
    CreateOrdersBodyType,
    CreateOrdersResType,
    GetOrderDetailResType,
    GetOrdersQueryParamsType,
    GetOrdersResType,
    PayGuestOrdersBodyType,
    PayGuestOrdersResType,
    UpdateOrderBodyType,
    UpdateOrderResType,
} from '@/schemaValidations';

const BACKEND_API = {
    ORDERS: '/orders',
};

const orderApiRequest = {
    getOrders: (query: GetOrdersQueryParamsType) => {
        const queryString = querystring.stringify({
            ...query,
            fromDate: query?.fromDate?.toISOString(),
            toDate: query?.toDate?.toISOString(),
        });
        return http.get<GetOrdersResType>(`${BACKEND_API.ORDERS}?${queryString}`);
    },

    getOrderDetail: (id: number) => {
        return http.get<GetOrderDetailResType>(`${BACKEND_API.ORDERS}/${id}`);
    },

    createOrders: (body: CreateOrdersBodyType) => {
        return http.post<CreateOrdersResType>(BACKEND_API.ORDERS, body);
    },

    updateOrder: (orderId: number, body: UpdateOrderBodyType) => {
        return http.put<UpdateOrderResType>(`${BACKEND_API.ORDERS}/${orderId}`, body);
    },

    payment: (body: PayGuestOrdersBodyType) => {
        return http.post<PayGuestOrdersResType>(`${BACKEND_API.ORDERS}/pay`, body);
    },
};

export default orderApiRequest;

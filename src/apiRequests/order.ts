import { http } from '@/lib';

import type { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations';

const BACKEND_API = {
    ORDERS: '/orders',
};

const orderApiRequest = {
    orders: () => http.get<GetOrdersResType>(BACKEND_API.ORDERS),

    updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
        http.put<UpdateOrderResType>(`${BACKEND_API.ORDERS}/${orderId}`, body),
};

export default orderApiRequest;

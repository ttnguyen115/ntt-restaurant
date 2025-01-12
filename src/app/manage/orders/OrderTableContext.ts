import { createContext, use } from 'react';

import { OrderStatusValues } from '@/constants';

import { OrderObjectByGuestID } from './types';

export const OrderTableContext = createContext({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setOrderIdEdit: (value: number | undefined) => {},
    orderIdEdit: undefined as number | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    changeStatus: (payload: {
        orderId: number;
        dishId: number;
        status: (typeof OrderStatusValues)[number];
        quantity: number;
    }) => {},
    orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export const useOrderTable = () => use(OrderTableContext);

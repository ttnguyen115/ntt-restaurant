import { OrderStatusValues } from '@/constants';

import { GetOrdersResType } from '@/schemaValidations';

export type StatusCountObject = Record<(typeof OrderStatusValues)[number], number>;

export type Statics = {
    status: StatusCountObject;
    table: Record<number, Record<number, StatusCountObject>>;
};

export type OrderObjectByGuestID = Record<number, GetOrdersResType['data']>;

export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

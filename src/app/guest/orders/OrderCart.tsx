'use client';

import { memo, useMemo } from 'react';

import Image from 'next/image';

import { formatCurrency, getVietnameseOrderStatus } from '@/utilities';

import { useGetGuestOrders } from '@/hooks';

import { Badge } from '@/components/ui/badge';

function OrderCart() {
    const { data } = useGetGuestOrders();

    const orders = useMemo(() => data?.payload.data ?? [], [data?.payload.data]);

    const totalPrice = useMemo(() => {
        return orders.reduce((result, order) => {
            return result + order.dishSnapshot.price * order.quantity;
        }, 0);
    }, [orders]);

    return (
        <>
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="flex gap-4"
                >
                    <div className="flex-shrink-0 relative">
                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className="object-cover w-[80px] h-[80px] rounded-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm">{order.dishSnapshot.name}</h3>
                        <div className="text-xs font-semibold">
                            {formatCurrency(order.dishSnapshot.price)} x&nbsp;
                            <Badge className="px-1">{order.quantity}</Badge>
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                        <Badge variant="outline">{getVietnameseOrderStatus(order.status)}</Badge>
                    </div>
                </div>
            ))}
            <div className="sticky bottom-0">
                <div className="w-full justify-between space-x-6 font-semibold">
                    <span>Total · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </div>
            </div>
        </>
    );
}

export default memo(OrderCart);

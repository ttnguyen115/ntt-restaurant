'use client';

import { memo, useEffect, useMemo } from 'react';

import Image from 'next/image';

import { formatCurrency, getVietnameseOrderStatus } from '@/utilities';

import { toast, useGetGuestOrders } from '@/hooks';

import { Badge } from '@/components/ui/badge';

import { clientSocket } from '@/lib';

import type { UpdateOrderResType } from '@/schemaValidations';

function OrderCart() {
    const { data, refetch } = useGetGuestOrders();

    const orders = useMemo(() => data?.payload.data ?? [], [data?.payload.data]);

    const totalPrice = useMemo(() => {
        return orders.reduce((result, order) => {
            return result + order.dishSnapshot.price * order.quantity;
        }, 0);
    }, [orders]);

    useEffect(() => {
        function onConnect() {
            console.log('socket from guest/orders/OrderCart is connected.');
        }

        function onDisconnect() {
            console.log('socket from guest/orders/OrderCart is disconnected.');
        }

        async function onUpdateOrder(data: UpdateOrderResType['data']) {
            const {
                dishSnapshot: { name },
                quantity,
                status,
            } = data;
            const description = `${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(status)}"`;

            toast({ description });
            await refetch();
        }

        if (clientSocket.connected) onConnect();

        clientSocket.on('update-order', onUpdateOrder);
        clientSocket.on('connect', onConnect);
        clientSocket.on('disconnect', onDisconnect);

        return () => {
            clientSocket.off('update-order', onUpdateOrder);
            clientSocket.off('connect', onConnect);
            clientSocket.off('disconnect', onDisconnect);
        };
    }, [refetch]);

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

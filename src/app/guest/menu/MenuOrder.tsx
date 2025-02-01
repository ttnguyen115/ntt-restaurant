'use client';

import { memo, useCallback, useMemo, useState } from 'react';

import Image from 'next/image';

import { formatCurrency } from '@/utilities';

import { useGetAllDishes } from '@/hooks';

import QuantityController from '@/components/QuantityController';
import { Button } from '@/components/ui/button';

import { GuestCreateOrdersBodyType } from '@/schemaValidations';

function MenuOrder() {
    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

    const { data } = useGetAllDishes();

    const dishes = useMemo(() => data?.payload.data || [], []);

    const totalPrice = useMemo(() => {
        return dishes.reduce((result, dish) => {
            const order = orders.find((o) => o.dishId === dish.id);
            if (!order) return result;
            return result + order.quantity * dish.price;
        }, 0);
    }, [dishes, orders]);

    // TODO: this function seems to be duplicated in AddOrder, should be refactor them as a utility
    const handleChangeQuantity = useCallback((dishId: number, quantity: number) => {
        setOrders((prevOrders) => {
            if (quantity === 0) {
                return prevOrders.filter((order) => order.dishId !== dishId);
            }

            const index = prevOrders.findIndex((order) => order.dishId === dishId);
            if (index === -1) {
                return [...prevOrders, { dishId, quantity }];
            }

            const newOrders = [...prevOrders];
            newOrders[index] = { ...newOrders[index], quantity };
            return newOrders;
        });
    }, []);

    return (
        <>
            {dishes.map((dish) => (
                <div
                    key={dish.id}
                    className="flex gap-4"
                >
                    <div className="flex-shrink-0">
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className="object-cover w-[80px] h-[80px] rounded-md"
                        />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm">{dish.name}</h3>
                        <p className="text-xs">{dish.description}</p>
                        <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
                    </div>
                    <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                        <QuantityController
                            onChange={(value) => handleChangeQuantity(dish.id, value)}
                            value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                        />
                    </div>
                </div>
            ))}
            <div className="sticky bottom-0">
                <Button className="w-full justify-between">
                    <span>Giỏ hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}

export default memo(MenuOrder);

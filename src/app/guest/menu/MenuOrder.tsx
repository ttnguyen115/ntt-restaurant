'use client';

import { memo, useCallback, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { clsx } from 'clsx';

import { formatCurrency, getVietnameseDishStatus } from '@/utilities';

import { AppNavigationRoutes, DishStatus } from '@/constants';

import { useGetAllDishes, useUpdateGuestOrder } from '@/hooks';

import QuantityController from '@/components/QuantityController';
import { Button } from '@/components/ui/button';

import { handleErrorApi } from '@/lib';

import type { GuestCreateOrdersBodyType } from '@/schemaValidations';

function MenuOrder() {
    const router = useRouter();

    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

    const { data } = useGetAllDishes();
    const { mutateAsync: updateGuestOrder, isPending } = useUpdateGuestOrder();

    const dishes = useMemo(() => data?.payload.data || [], [data?.payload.data]);

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

    const handleUpdateGuestOrder = useCallback(async () => {
        if (isPending) return;

        try {
            await updateGuestOrder(orders);
            router.push(AppNavigationRoutes.GUEST_ORDERS);
        } catch (error) {
            handleErrorApi({ error });
        }
    }, [orders, router, isPending, updateGuestOrder]);

    return (
        <>
            {dishes
                .filter((dish) => dish.status !== DishStatus.Hidden)
                .map((dish) => (
                    <div
                        key={dish.id}
                        className={clsx('flex gap-4', dish.status === DishStatus.Unavailable && 'pointer-events-none')}
                    >
                        <div className="flex-shrink-0 relative">
                            {dish.status === DishStatus.Unavailable && (
                                <span className="absolute inset-0 flex items-center justify-center text-sm">
                                    {getVietnameseDishStatus(dish.status)}
                                </span>
                            )}
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
                <Button
                    className="w-full justify-between"
                    disabled={orders.length === 0 || isPending}
                    onClick={handleUpdateGuestOrder}
                >
                    <span>Giỏ hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}

export default memo(MenuOrder);

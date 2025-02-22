'use client';

import { memo, useCallback, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';

import { cn, formatCurrency } from '@/utilities';

import { DishStatus } from '@/constants';

import { toast, useCreateGuest, useCreateOrders, useGetAllDishes } from '@/hooks';

import QuantityController from '@/components/QuantityController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { handleErrorApi } from '@/lib';

import {
    type CreateOrdersBodyType,
    type GetListGuestsResType,
    GuestLoginBody,
    type GuestLoginBodyType,
} from '@/schemaValidations';

import GuestsDialog from './GuestsDialog';
import TablesDialog from './TablesDialog';

function AddOrder() {
    const [open, setOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GetListGuestsResType['data'][0] | null>(null);
    const [isNewGuest, setIsNewGuest] = useState(true);
    const [orders, setOrders] = useState<CreateOrdersBodyType['orders']>([]);

    const { data } = useGetAllDishes();
    const { mutateAsync: createOrders, isPending: isCreatingOrders } = useCreateOrders();
    const { mutateAsync: createGuest, isPending: isCreatingGuest } = useCreateGuest();

    const dishes = useMemo(() => data?.payload.data ?? [], [data?.payload.data]);

    const totalPrice = useMemo(
        () =>
            dishes.reduce((result, dish) => {
                const order = orders.find((o) => o.dishId === dish.id);
                if (!order) return result;
                return result + order.quantity * dish.price;
            }, 0),
        [dishes, orders]
    );

    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: '',
            tableNumber: 0,
        },
    });
    const name = form.watch('name');
    const tableNumber = form.watch('tableNumber');

    const handleQuantityChange = useCallback((dishId: number, quantity: number) => {
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

    const reset = useCallback(() => {
        form.reset();
        setSelectedGuest(null);
        setIsNewGuest(true);
        setOrders([]);
        setOpen(false);
    }, [form]);

    const handleOrder = useCallback(async () => {
        if (isCreatingOrders || isCreatingGuest) return;

        let guestId = selectedGuest?.id;
        try {
            if (isNewGuest) {
                const response = await createGuest({ name, tableNumber });
                guestId = response.payload.data.id;
            }
            if (!guestId) {
                toast({ description: 'Hãy chọn một khách hàng' });
                return;
            }
            await createOrders({ guestId, orders });
            reset();
        } catch (error) {
            handleErrorApi({
                error,
                setError: form.setError,
            });
        }
    }, [
        isCreatingOrders,
        isCreatingGuest,
        isNewGuest,
        name,
        orders,
        selectedGuest?.id,
        tableNumber,
        createGuest,
        createOrders,
        form.setError,
        reset,
    ]);

    const renderDishes = dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
            <div
                key={dish.id}
                className={cn('flex gap-4', {
                    'pointer-events-none': dish.status === DishStatus.Unavailable,
                })}
            >
                <div className="flex-shrink-0 relative">
                    {dish.status === DishStatus.Unavailable && (
                        <span className="absolute inset-0 flex items-center justify-center text-sm">Hết hàng</span>
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
                        onChange={(value) => handleQuantityChange(dish.id, value)}
                        value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                    />
                </div>
            </div>
        ));

    return (
        <Dialog
            onOpenChange={(value) => {
                if (!value) reset();
                setOpen(value);
            }}
            open={open}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="h-7 gap-1"
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Tạo đơn hàng</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Tạo đơn hàng</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="isNewGuest">Khách hàng mới</Label>
                    <div className="col-span-3 flex items-center">
                        <Switch
                            id="isNewGuest"
                            checked={isNewGuest}
                            onCheckedChange={setIsNewGuest}
                        />
                    </div>
                </div>
                {isNewGuest && (
                    <Form {...form}>
                        <form
                            noValidate
                            className="grid auto-rows-max items-start gap-4 md:gap-8"
                            id="add-employee-form"
                        >
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="name">Tên khách hàng</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="name"
                                                        className="w-full"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tableNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="tableNumber">Chọn bàn</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <div className="flex items-center gap-4">
                                                        <div>{field.value}</div>
                                                        <TablesDialog
                                                            onChoose={(table) => {
                                                                field.onChange(table.number);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                )}
                {!isNewGuest && (
                    <GuestsDialog
                        onChoose={(guest) => {
                            setSelectedGuest(guest);
                        }}
                    />
                )}
                {!isNewGuest && selectedGuest && (
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="selectedGuest">Khách đã chọn</Label>
                        <div className="col-span-3 w-full gap-4 flex items-center">
                            <div>
                                {selectedGuest.name} (#{selectedGuest.id})
                            </div>
                            <div>Bàn: {selectedGuest.tableNumber}</div>
                        </div>
                    </div>
                )}
                {renderDishes}
                <DialogFooter>
                    <Button
                        className="w-full justify-between"
                        onClick={handleOrder}
                        disabled={orders.length === 0}
                    >
                        <span>Đặt hàng · {orders.length} món</span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(AddOrder);

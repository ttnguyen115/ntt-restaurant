'use client';

import { memo, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { getVietnameseOrderStatus } from '@/utilities';

import { OrderStatus, OrderStatusValues } from '@/constants';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DishListResType, UpdateOrderBody, UpdateOrderBodyType } from '@/schemaValidations';

import DishesDialog from './DishesDialog';
import { fakeOrderDetail } from './mocks';

function EditOrder({
    id,
    setId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmitSuccess,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const [selectedDish, setSelectedDish] = useState<DishListResType['data'][0]>(fakeOrderDetail.dishSnapshot as any);

    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    const orderDetail = fakeOrderDetail;
    const form = useForm<UpdateOrderBodyType>({
        resolver: zodResolver(UpdateOrderBody),
        defaultValues: {
            status: OrderStatus.Pending,
            dishId: 0,
            quantity: 1,
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSubmit = async (values: UpdateOrderBodyType) => {};

    const reset = () => {
        setId(undefined);
    };

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) {
                    reset();
                }
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật đơn hàng</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-order-form"
                        onSubmit={form.handleSubmit(onSubmit, console.log)}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="dishId"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
                                        <FormLabel>Món ăn</FormLabel>
                                        <div className="flex items-center col-span-2 space-x-4">
                                            <Avatar className="aspect-square w-[50px] h-[50px] rounded-md object-cover">
                                                <AvatarImage src={selectedDish?.image} />
                                                <AvatarFallback className="rounded-none">
                                                    {selectedDish?.name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>{selectedDish?.name}</div>
                                        </div>

                                        <DishesDialog
                                            onChoose={(dish) => {
                                                field.onChange(dish.id);
                                                setSelectedDish(dish);
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="quantity">Số lượng</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="quantity"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    className="w-16 text-center"
                                                    {...field}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        const numberValue = Number(value);
                                                        if (Number.isNaN(numberValue)) return;
                                                        field.onChange(numberValue);
                                                    }}
                                                />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <FormLabel>Trạng thái</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl className="col-span-3">
                                                    <SelectTrigger className="w-[200px]">
                                                        <SelectValue placeholder="Trạng thái" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {OrderStatusValues.map((status) => (
                                                        <SelectItem
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {getVietnameseOrderStatus(status)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="edit-order-form"
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditOrder);

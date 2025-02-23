'use client';

import { memo, useCallback, useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { getTableLink, getVietnameseTableStatus } from '@/utilities';

import { TableStatus, TableStatusValues } from '@/constants';

import { toast, useGetTableByNumber, useUpdateTable } from '@/hooks';

import QRCodeTable from '@/components/QRCodeTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { handleErrorApi, Link } from '@/lib';

import { UpdateTableBody, type UpdateTableBodyType } from '@/schemaValidations';

function EditTable({
    id,
    setId,
    onSubmitSuccess,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const { data: table } = useGetTableByNumber({ number: id as number, enabled: Boolean(id) });
    const { mutateAsync: updateTable, isPending } = useUpdateTable();

    const form = useForm<UpdateTableBodyType>({
        resolver: zodResolver(UpdateTableBody),
        defaultValues: {
            capacity: 2,
            status: TableStatus.Hidden,
            changeToken: false,
        },
    });

    const resetForm = useCallback(() => {
        form.reset();
        setId(undefined);
    }, [form, setId]);

    const onSubmit = useCallback(
        async (values: UpdateTableBodyType) => {
            if (isPending) return;
            try {
                const {
                    payload: { message },
                } = await updateTable({ number: id as number, ...values });
                toast({ title: message });
                resetForm();
                if (onSubmitSuccess) onSubmitSuccess();
            } catch (error) {
                handleErrorApi({ error, setError: form.setError });
            }
        },
        [id, isPending, onSubmitSuccess, resetForm, updateTable, form.setError]
    );

    useEffect(() => {
        if (table) {
            const { capacity, status } = table.payload.data;
            form.reset({
                capacity,
                status,
                changeToken: form.getValues('changeToken'),
            });
        }
    }, [table, form]);

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) {
                    resetForm();
                }
            }}
        >
            <DialogContent
                className="sm:max-w-[600px] max-h-screen overflow-auto"
                onCloseAutoFocus={resetForm}
            >
                <DialogHeader>
                    <DialogTitle>Cập nhật bàn ăn</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-table-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        onReset={resetForm}
                    >
                        <div className="grid gap-4 py-4">
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label htmlFor="name">Số hiệu bàn</Label>
                                    <div className="col-span-3 w-full space-y-2">
                                        <Input
                                            id="number"
                                            type="number"
                                            className="w-full"
                                            value={id as number}
                                            readOnly
                                        />
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">Sức chứa (người)</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input
                                                    id="capacity"
                                                    className="w-full"
                                                    {...field}
                                                    type="number"
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
                                            <Label htmlFor="description">Trạng thái</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {TableStatusValues.map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {getVietnameseTableStatus(status)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="changeToken"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="price">Đổi QR Code</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="changeToken"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label>QR Code</Label>
                                    <div className="col-span-3 w-full space-y-2">
                                        {table && (
                                            <QRCodeTable
                                                tableNumber={table.payload.data.number}
                                                token={table.payload.data.token}
                                            />
                                        )}
                                    </div>
                                </div>
                            </FormItem>
                            <FormItem>
                                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                    <Label>URL gọi món</Label>
                                    <div className="col-span-3 w-full space-y-2">
                                        {table && (
                                            <Link
                                                href={getTableLink({
                                                    token: table.payload.data.token,
                                                    tableNumber: table.payload.data.number,
                                                })}
                                                target="_blank"
                                                className="break-all"
                                            >
                                                {getTableLink({
                                                    token: table.payload.data.token,
                                                    tableNumber: table.payload.data.number,
                                                })}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </FormItem>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        type="submit"
                        form="edit-table-form"
                    >
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default memo(EditTable);

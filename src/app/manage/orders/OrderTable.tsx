'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import { endOfDay, format, startOfDay } from 'date-fns';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn, getVietnameseOrderStatus } from '@/utilities';

import { AppNavigationRoutes, OrderStatusValues } from '@/constants';

import { toast, useGetAllOrders, useGetAllTables, useUpdateOrder } from '@/hooks';

import AutoPagination from '@/components/AutoPagination';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { clientSocket, handleErrorApi } from '@/lib';

import type { GuestCreateOrdersResType, UpdateOrderResType } from '@/schemaValidations';

import AddOrder from './AddOrder';
import EditOrder from './EditOrder';
import OrderStatics from './OrderStatics';
import OrderTableColumns from './OrderTableColumns';
import { OrderTableContext } from './OrderTableContext';
import TableSkeleton from './TableSkeleton';
import useOrderService from './useOrderService';

const ITEMS_PER_PAGE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

function OrderTable() {
    const searchParam = useSearchParams();
    const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
    const pageIndex = page - 1;

    const [openStatusFilter, setOpenStatusFilter] = useState(false);
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);
    const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
        pageSize: ITEMS_PER_PAGE,
    });

    const { data: ordersRes, isPending, isFetching, refetch: refetchOrders } = useGetAllOrders({ fromDate, toDate });
    const { data: tablesRes } = useGetAllTables();
    const { mutateAsync: updateOrder } = useUpdateOrder();

    const orders = ordersRes?.payload.data ?? [];
    const isGettingOrders = isPending || isFetching;
    const { statics, orderObjectByGuestId, servingGuestByTableNumber } = useOrderService(orders);

    const table = useReactTable({
        data: orders,
        columns: OrderTableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    });

    const tables = useMemo(() => tablesRes?.payload.data ?? [], [tablesRes?.payload.data]);
    const tablesSortedByNumber = useMemo(() => tables.sort((a, b) => a.number - b.number), [tables]);

    const changeStatus = useCallback(
        async (body: {
            orderId: number;
            dishId: number;
            status: (typeof OrderStatusValues)[number];
            quantity: number;
        }) => {
            try {
                await updateOrder(body);
            } catch (error) {
                handleErrorApi({ error });
            }
        },
        [updateOrder]
    );

    const resetDateFilter = useCallback(() => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    }, []);

    const renderStatusCombobox = useCallback(() => {
        const getFieldStatus = table.getColumn('status')?.getFilterValue();

        return getFieldStatus
            ? getVietnameseOrderStatus(getFieldStatus as (typeof OrderStatusValues)[number])
            : 'Trạng thái';
    }, [table]);

    useEffect(() => {
        table.setPagination({
            pageIndex,
            pageSize: ITEMS_PER_PAGE,
        });
    }, [table, pageIndex]);

    useEffect(() => {
        function onConnect() {
            console.log('socket from manage/orders/OrderTable is connected.');
        }

        function onDisconnect() {
            console.log('socket from manage/orders/OrderTable is disconnected.');
        }

        async function refetch() {
            const now = new Date();
            if (now >= fromDate && now <= toDate) {
                await refetchOrders();
            }
        }

        // when having new orders from guest
        async function onNewOrder(data: GuestCreateOrdersResType['data']) {
            const { guest } = data[0];
            const description = `${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} đơn`;

            toast({ description });
            await refetch();
        }

        // When internal admins change order status
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

        clientSocket.on('new-order', onNewOrder);
        clientSocket.on('update-order', onUpdateOrder);
        clientSocket.on('connect', onConnect);
        clientSocket.on('disconnect', onDisconnect);

        return () => {
            clientSocket.off('new-order', onNewOrder);
            clientSocket.off('update-order', onUpdateOrder);
            clientSocket.off('connect', onConnect);
            clientSocket.off('disconnect', onDisconnect);
        };
    }, [fromDate, toDate, refetchOrders]);

    return (
        <OrderTableContext.Provider
            value={{
                orderIdEdit,
                setOrderIdEdit,
                changeStatus,
                orderObjectByGuestId,
            }}
        >
            <div className="w-full">
                <EditOrder
                    id={orderIdEdit}
                    setId={setOrderIdEdit}
                    onSubmitSuccess={() => {}}
                />
                <div className=" flex items-center">
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center">
                            <span className="mr-2">Từ</span>
                            <Input
                                type="datetime-local"
                                placeholder="Từ ngày"
                                className="text-sm"
                                value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                                onChange={(event) => setFromDate(new Date(event.target.value))}
                            />
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Đến</span>
                            <Input
                                type="datetime-local"
                                placeholder="Đến ngày"
                                value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                                onChange={(event) => setToDate(new Date(event.target.value))}
                            />
                        </div>
                        <Button
                            className=""
                            variant={'outline'}
                            onClick={resetDateFilter}
                        >
                            Reset
                        </Button>
                    </div>
                    <div className="ml-auto">
                        <AddOrder />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 py-4">
                    <Input
                        placeholder="Tên khách"
                        value={(table.getColumn('guestName')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('guestName')?.setFilterValue(event.target.value)}
                        className="max-w-[100px]"
                    />
                    <Input
                        placeholder="Số bàn"
                        value={(table.getColumn('tableNumber')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('tableNumber')?.setFilterValue(event.target.value)}
                        className="max-w-[80px]"
                    />
                    <Popover
                        open={openStatusFilter}
                        onOpenChange={setOpenStatusFilter}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openStatusFilter}
                                className="w-[150px] text-sm justify-between"
                            >
                                {renderStatusCombobox()}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandGroup>
                                    <CommandList>
                                        {OrderStatusValues.map((status) => (
                                            <CommandItem
                                                key={status}
                                                value={status}
                                                onSelect={(currentValue) => {
                                                    table
                                                        .getColumn('status')
                                                        ?.setFilterValue(
                                                            currentValue === table.getColumn('status')?.getFilterValue()
                                                                ? ''
                                                                : currentValue
                                                        );
                                                    setOpenStatusFilter(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4',
                                                        table.getColumn('status')?.getFilterValue() === status
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {getVietnameseOrderStatus(status)}
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <OrderStatics
                    statics={statics}
                    tableList={tablesSortedByNumber}
                    servingGuestByTableNumber={servingGuestByTableNumber}
                />
                {isGettingOrders ? (
                    <TableSkeleton />
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const renderFlex = () =>
                                                flexRender(header.column.columnDef.header, header.getContext());
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : renderFlex()}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={OrderTableColumns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="text-xs text-muted-foreground py-4 flex-1">
                        Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
                        <strong>{orders.length}</strong> kết quả
                    </div>
                    <div>
                        <AutoPagination
                            page={table.getState().pagination.pageIndex + 1}
                            pageSize={table.getPageCount()}
                            pathname={AppNavigationRoutes.MANAGE_ORDERS}
                        />
                    </div>
                </div>
            </div>
        </OrderTableContext.Provider>
    );
}

export default memo(OrderTable);

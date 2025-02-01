import { memo, useEffect, useState } from 'react';

import {
    type ColumnDef,
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

import { formatDateTimeToLocaleString, simpleMatchText } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import AutoPagination from '@/components/AutoPagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { type GetListGuestsResType } from '@/schemaValidations';

type GuestItem = GetListGuestsResType['data'][0];

export const columns: ColumnDef<GuestItem>[] = [
    {
        accessorKey: 'name',
        header: 'Tên',
        cell: ({ row }) => (
            <div className="capitalize">
                {row.getValue('name')} | (#{row.original.id})
            </div>
        ),
        filterFn: (row, columnId, filterValue: string) => {
            if (filterValue === undefined) return true;
            return simpleMatchText(row.original.name + String(row.original.id), String(filterValue));
        },
    },
    {
        accessorKey: 'tableNumber',
        header: 'Số bàn',
        cell: ({ row }) => <div className="capitalize">{row.getValue('tableNumber')}</div>,
        filterFn: (row, columnId, filterValue: string) => {
            if (filterValue === undefined) return true;
            return simpleMatchText(String(row.original.tableNumber), String(filterValue));
        },
    },
    {
        accessorKey: 'createdAt',
        header: () => <div>Tạo</div>,
        cell: ({ row }) => (
            <div className="flex items-center space-x-4 text-sm">
                {formatDateTimeToLocaleString(row.getValue('createdAt'))}
            </div>
        ),
    },
];

const ITEMS_PER_PAGE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

function GuestsDialog({ onChoose }: { onChoose: (guest: GuestItem) => void }) {
    const [open, setOpen] = useState(false);
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
    });

    const data: GetListGuestsResType['data'] = [];

    const table = useReactTable({
        data,
        columns,
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

    useEffect(() => {
        table.setPagination({
            pageIndex: 0,
            pageSize: ITEMS_PER_PAGE,
        });
    }, [table]);

    const choose = (guest: GuestItem) => {
        onChoose(guest);
        setOpen(false);
    };

    const resetDateFilter = () => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">Chọn khách</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Chọn khách hàng</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
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
                        <div className="flex items-center py-4 gap-2">
                            <Input
                                placeholder="Tên hoặc Id"
                                value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                                onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                                className="w-[170px]"
                            />
                            <Input
                                placeholder="Số bàn"
                                value={(table.getColumn('tableNumber')?.getFilterValue() as string) ?? ''}
                                onChange={(event) => table.getColumn('tableNumber')?.setFilterValue(event.target.value)}
                                className="w-[80px]"
                            />
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                if (header.isPlaceholder) return null;

                                                return (
                                                    <TableHead key={header.id}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
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
                                                onClick={() => {
                                                    choose(row.original);
                                                }}
                                                className="cursor-pointer"
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
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="text-xs text-muted-foreground py-4 flex-1">
                                Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
                                <strong>{data.length}</strong> kết quả
                            </div>
                            <div>
                                <AutoPagination
                                    page={table.getState().pagination.pageIndex + 1}
                                    pageSize={table.getPageCount()}
                                    pathname={AppNavigationRoutes.MANAGE_GUESTS}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default memo(GuestsDialog);

import { memo, useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import { formatCurrency, getVietnameseDishStatus, simpleMatchText } from '@/utilities';

import { useGetAllDishes } from '@/hooks';

import AutoPagination from '@/components/AutoPagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DishListResType } from '@/schemaValidations/dish';

type DishItem = DishListResType['data'][0];

export const columns: ColumnDef<DishItem>[] = [
    {
        id: 'dishName',
        header: 'Món ăn',
        cell: ({ row }) => (
            <div className="flex items-center space-x-4">
                <Image
                    src={row.original.image}
                    alt={row.original.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover w-[50px] h-[50px]"
                />
                <span>{row.original.name}</span>
            </div>
        ),
        filterFn: (row, columnId, filterValue: string) => {
            if (filterValue === undefined) return true;
            return simpleMatchText(String(row.original.name), String(filterValue));
        },
    },
    {
        accessorKey: 'price',
        header: 'Giá cả',
        cell: ({ row }) => <div className="capitalize">{formatCurrency(row.getValue('price'))}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue('status'))}</div>,
    },
];

interface DishesDialogProps {
    onChoose: (dish: DishItem) => void;
}

const ITEMS_PER_PAGE = 10;

function DishesDialog({ onChoose }: DishesDialogProps) {
    const [open, setOpen] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
    });

    const { data } = useGetAllDishes();
    const dishes = data?.payload.data ?? [];

    const table = useReactTable({
        data: dishes,
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

    const choose = useCallback(
        (dish: DishItem) => {
            onChoose(dish);
            setOpen(false);
        },
        [onChoose]
    );

    useEffect(() => {
        table.setPagination({
            pageIndex: 0,
            pageSize: ITEMS_PER_PAGE,
        });
    }, [table]);

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button variant="outline">Thay đổi</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
                <DialogHeader>
                    <DialogTitle>Chọn món ăn</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Lọc tên"
                                value={(table.getColumn('dishName')?.getFilterValue() as string) ?? ''}
                                onChange={(event) => table.getColumn('dishName')?.setFilterValue(event.target.value)}
                                className="max-w-sm"
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
                                                onClick={() => choose(row.original)}
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
                                <strong>{dishes.length}</strong> kết quả
                            </div>
                            <div>
                                <AutoPagination
                                    isLink={false}
                                    onClick={(pageNumber) =>
                                        table.setPagination({
                                            pageIndex: pageNumber - 1,
                                            pageSize: ITEMS_PER_PAGE,
                                        })
                                    }
                                    page={table.getState().pagination.pageIndex + 1}
                                    pageSize={table.getPageCount()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default memo(DishesDialog);

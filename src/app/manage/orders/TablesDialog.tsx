import { memo, useCallback, useEffect, useState } from 'react';

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

import { cn, getVietnameseTableStatus, simpleMatchText } from '@/utilities';

import { AppNavigationRoutes, TableStatus } from '@/constants';

import { useGetAllTables } from '@/hooks';

import AutoPagination from '@/components/AutoPagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { TableListResType } from '@/schemaValidations';

type TableItem = TableListResType['data'][0];

export const columns: ColumnDef<TableItem>[] = [
    {
        accessorKey: 'number',
        header: 'Số bàn',
        cell: ({ row }) => <div className="capitalize">{row.getValue('number')}</div>,
        filterFn: (row, columnId, filterValue: string) => {
            if (filterValue === undefined) return true;
            return simpleMatchText(String(row.original.number), String(filterValue));
        },
    },
    {
        accessorKey: 'capacity',
        header: 'Sức chứa',
        cell: ({ row }) => <div className="capitalize">{row.getValue('capacity')}</div>,
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue('status'))}</div>,
    },
];

interface TablesDialogProps {
    onChoose: (table: TableItem) => void;
}

const ITEMS_PER_PAGE = 10;

function TablesDialog({ onChoose }: TablesDialogProps) {
    const [open, setOpen] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: ITEMS_PER_PAGE,
    });

    const { data } = useGetAllTables();
    const tables = data?.payload.data ?? [];

    const table = useReactTable({
        data: tables,
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
        (selectedTable: TableItem) => {
            onChoose(selectedTable);
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
                    <DialogTitle>Chọn bàn</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Số bàn"
                                value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
                                onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
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
                                                    if (
                                                        row.original.status === TableStatus.Available ||
                                                        row.original.status === TableStatus.Reserved
                                                    ) {
                                                        choose(row.original);
                                                    }
                                                }}
                                                className={cn({
                                                    'cursor-pointer':
                                                        row.original.status === TableStatus.Available ||
                                                        row.original.status === TableStatus.Reserved,
                                                    'cursor-not-allowed': row.original.status === TableStatus.Hidden,
                                                })}
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
                                <strong>{tables.length}</strong> kết quả
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

export default memo(TablesDialog);

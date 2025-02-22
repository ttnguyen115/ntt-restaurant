'use client';

import { createContext, memo, use, useCallback, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
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

import { getVietnameseTableStatus } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { toast, useDeleteTable, useGetAllTables } from '@/hooks';

import AutoPagination from '@/components/AutoPagination';
import QRCodeTable from '@/components/QRCodeTable';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { handleErrorApi } from '@/lib';

import type { TableListResType } from '@/schemaValidations';

import AddTable from './AddTable';
import EditTable from './EditTable';

type TableItem = TableListResType['data'][0];

interface ITableContext {
    tableDelete: TableItem | null;
    tableIdEdit: number | undefined;
    setTableDelete: (value: TableItem | null) => void;
    setTableIdEdit: (value: number) => void;
}

const TableContext = createContext<ITableContext>({
    tableDelete: null,
    tableIdEdit: undefined,
    setTableDelete: () => {},
    setTableIdEdit: () => {},
});

export const columns: ColumnDef<TableItem>[] = [
    {
        accessorKey: 'number',
        header: 'Số bàn',
        cell: ({ row }) => <div className="capitalize">{row.getValue('number')}</div>,
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
    {
        accessorKey: 'token',
        header: 'QR Code',
        cell: ({ row }) => (
            <QRCodeTable
                tableNumber={row.getValue('number')}
                token={row.getValue('token')}
            />
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setTableIdEdit, setTableDelete } = use(TableContext);

            const openEditTable = useCallback(() => {
                setTableIdEdit(row.original.number);
            }, [row.original.number, setTableIdEdit]);

            const openDeleteTable = useCallback(() => {
                setTableDelete(row.original);
            }, [row.original, setTableDelete]);

            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

function AlertDialogDeleteTable({
    tableDelete,
    setTableDelete,
}: {
    tableDelete: TableItem | null;
    setTableDelete: (value: TableItem | null) => void;
}) {
    const { mutateAsync: deleteTable } = useDeleteTable();

    const handleDeleteTable = useCallback(async () => {
        if (tableDelete) {
            try {
                const result = await deleteTable(tableDelete.number);
                // close modal
                setTableDelete(null);
                toast({
                    title: result.payload.message,
                });
            } catch (error) {
                handleErrorApi({ error });
            }
        }
    }, [tableDelete, deleteTable, setTableDelete]);

    const handleCancel = useCallback(() => {
        setTableDelete(null);
    }, [setTableDelete]);

    return (
        <AlertDialog
            open={Boolean(tableDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setTableDelete(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bàn{' '}
                        <span className="bg-foreground text-primary-foreground rounded px-1">
                            {tableDelete?.number}
                        </span>{' '}
                        sẽ bị xóa vĩnh viễn
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTable}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const ITEMS_PER_PAGE = 10;

function DishTable() {
    const searchParam = useSearchParams();
    const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
    const pageIndex = page - 1;

    const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
    const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
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

    useEffect(() => {
        table.setPagination({
            pageIndex,
            pageSize: ITEMS_PER_PAGE,
        });
    }, [table, pageIndex]);

    return (
        <TableContext.Provider value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}>
            <div className="w-full">
                {tableIdEdit && (
                    <EditTable
                        id={tableIdEdit}
                        setId={setTableIdEdit}
                    />
                )}
                <AlertDialogDeleteTable
                    tableDelete={tableDelete}
                    setTableDelete={setTableDelete}
                />
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Lọc số bàn"
                        value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <AddTable />
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                            page={table.getState().pagination.pageIndex + 1}
                            pageSize={table.getPageCount()}
                            pathname={AppNavigationRoutes.MANAGE_TABLES}
                        />
                    </div>
                </div>
            </div>
        </TableContext.Provider>
    );
}

export default memo(DishTable);

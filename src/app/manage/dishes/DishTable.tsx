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

import { formatCurrency, getVietnameseDishStatus } from '@/utilities';

import { AppNavigationRoutes } from '@/constants';

import { toast, useDeleteDish, useGetAllDishes } from '@/hooks';

import AutoPagination from '@/components/AutoPagination';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

import { DishListResType } from '@/schemaValidations';

import AddDish from './AddDish';
import EditDish from './EditDish';

type DishItem = DishListResType['data'][0];

interface IDishTableContext {
    dishDelete: DishItem | null;
    dishIdEdit: number | undefined;
    setDishDelete: (value: DishItem | null) => void;
    setDishIdEdit: (value: number) => void;
}

const DishTableContext = createContext<IDishTableContext>({
    dishDelete: null,
    dishIdEdit: undefined,
    setDishDelete: () => {},
    setDishIdEdit: () => {},
});

export const columns: ColumnDef<DishItem>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'image',
        header: 'Ảnh',
        cell: ({ row }) => (
            <div>
                <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                    <AvatarImage src={row.getValue('image')} />
                    <AvatarFallback className="rounded-none">{row.original.name}</AvatarFallback>
                </Avatar>
            </div>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Tên',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'price',
        header: 'Giá cả',
        cell: ({ row }) => <div className="capitalize">{formatCurrency(row.getValue('price'))}</div>,
    },
    {
        accessorKey: 'description',
        header: 'Mô tả',
        cell: ({ row }) => (
            <div
                dangerouslySetInnerHTML={{ __html: row.getValue('description') }}
                className="whitespace-pre-line"
            />
        ),
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue('status'))}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setDishIdEdit, setDishDelete } = use(DishTableContext);

            const openEditDish = useCallback(() => {
                setDishIdEdit(row.original.id);
            }, [row.original.id, setDishIdEdit]);

            const openDeleteDish = useCallback(() => {
                setDishDelete(row.original);
            }, [row.original, setDishDelete]);

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
                        <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface AlertDialogDeleteDishProps {
    dishDelete: DishItem | null;
    setDishDelete: (value: DishItem | null) => void;
}

function AlertDialogDeleteDish({ dishDelete, setDishDelete }: AlertDialogDeleteDishProps) {
    const { mutateAsync: deleteDish } = useDeleteDish();

    const handleDeleteDish = useCallback(async () => {
        if (dishDelete) {
            try {
                const result = await deleteDish(dishDelete.id);
                // close modal
                setDishDelete(null);
                toast({
                    title: result.payload.message,
                });
            } catch (error) {
                handleErrorApi({ error });
            }
        }
    }, [deleteDish, dishDelete, setDishDelete]);

    const handleCancel = useCallback(() => {
        setDishDelete(null);
    }, [setDishDelete]);

    return (
        <AlertDialog
            open={Boolean(dishDelete)}
            onOpenChange={(value) => {
                if (!value) {
                    setDishDelete(null);
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Món{' '}
                        <span className="bg-foreground text-primary-foreground rounded px-1">{dishDelete?.name}</span>{' '}
                        sẽ bị xóa vĩnh viễn
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDish}>Continue</AlertDialogAction>
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

    const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
    const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
        pageSize: ITEMS_PER_PAGE,
    });

    // TODO: oh maybe we can switch to query w pagination in later versions
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

    useEffect(() => {
        table.setPagination({
            pageIndex,
            pageSize: ITEMS_PER_PAGE,
        });
    }, [table, pageIndex]);

    return (
        <DishTableContext.Provider value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}>
            <div className="w-full">
                {dishIdEdit && (
                    <EditDish
                        id={dishIdEdit}
                        setId={setDishIdEdit}
                    />
                )}
                <AlertDialogDeleteDish
                    dishDelete={dishDelete}
                    setDishDelete={setDishDelete}
                />
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Lọc tên"
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <div className="ml-auto flex items-center gap-2">
                        <AddDish />
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
                        <strong>{dishes.length}</strong> kết quả
                    </div>
                    <div>
                        <AutoPagination
                            page={table.getState().pagination.pageIndex + 1}
                            pageSize={table.getPageCount()}
                            pathname={AppNavigationRoutes.MANAGE_DISHES}
                        />
                    </div>
                </div>
            </div>
        </DishTableContext.Provider>
    );
}

export default memo(DishTable);

'use client';

import { createContext, memo, use, useCallback, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
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

import { AuthContext } from '@/contexts';

import { AppNavigationRoutes, Role } from '@/constants';

import { toast, useDeleteAccount, useGetAllAccounts } from '@/hooks';

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

import type { AccountListResType, AccountType } from '@/schemaValidations';

import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';

type AccountItem = AccountListResType['data'][0];

interface IAccountTableContext {
    setEmployeeIdEdit: (value: number) => void;
    employeeIdEdit: number | undefined;
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
}

const AccountTableContext = createContext<IAccountTableContext>({
    employeeDelete: null,
    employeeIdEdit: undefined,
    setEmployeeDelete: () => {},
    setEmployeeIdEdit: () => {},
});

export const columns: ColumnDef<AccountType>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => (
            <div>
                <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                    <AvatarImage src={row.getValue('avatar')} />
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
        accessorKey: 'email',
        header: ({ column }) => {
            const handleEmailHeaderClick = () => column.toggleSorting(column.getIsSorted() === 'asc');

            return (
                <Button
                    variant="ghost"
                    onClick={handleEmailHeaderClick}
                >
                    Email
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setEmployeeIdEdit, setEmployeeDelete } = use(AccountTableContext);

            const openEditEmployee = useCallback(() => {
                setEmployeeIdEdit(row.original.id);
            }, [row.original.id, setEmployeeIdEdit]);

            const openDeleteEmployee = useCallback(() => {
                setEmployeeDelete(row.original);
            }, [row.original, setEmployeeDelete]);

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
                        <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteEmployee}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

interface AlertDialogDeleteAccount {
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
}

const AlertDialogDeleteAccount = memo(({ employeeDelete, setEmployeeDelete }: AlertDialogDeleteAccount) => {
    const { mutateAsync: deleteAccount } = useDeleteAccount();

    const handleOpenAlertDialog = useCallback(
        (value: boolean) => {
            if (!value) {
                setEmployeeDelete(null);
            }
        },
        [setEmployeeDelete]
    );

    const handleDeleteEmployee = useCallback(async () => {
        if (employeeDelete) {
            try {
                const result = await deleteAccount(employeeDelete.id);
                // close modal
                setEmployeeDelete(null);
                toast({
                    title: result.payload.message,
                });
            } catch (error) {
                handleErrorApi({ error });
            }
        }
    }, [deleteAccount, employeeDelete, setEmployeeDelete]);

    const handleCancel = useCallback(() => {
        setEmployeeDelete(null);
    }, [setEmployeeDelete]);

    return (
        <AlertDialog
            open={Boolean(employeeDelete)}
            onOpenChange={handleOpenAlertDialog}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tài khoản{' '}
                        <span className="bg-foreground text-primary-foreground rounded px-1">
                            {employeeDelete?.name}
                        </span>{' '}
                        sẽ bị xóa vĩnh viễn
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEmployee}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
});

const ITEMS_PER_PAGE = 10;

function AccountTable() {
    const { role } = use(AuthContext);

    const searchParam = useSearchParams();
    const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1;
    const pageIndex = page - 1;

    const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
    const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex,
        pageSize: ITEMS_PER_PAGE,
    });

    const { data } = useGetAllAccounts();
    const accounts = data?.payload.data ?? [];

    const table = useReactTable({
        data: accounts,
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
        <AccountTableContext.Provider value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
            <div className="w-full">
                {employeeIdEdit && (
                    <EditEmployee
                        id={employeeIdEdit}
                        setId={setEmployeeIdEdit}
                        onSubmitSuccess={() => {}}
                    />
                )}
                <AlertDialogDeleteAccount
                    employeeDelete={employeeDelete}
                    setEmployeeDelete={setEmployeeDelete}
                />
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter emails..."
                        value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    {role === Role.Owner && (
                        <div className="ml-auto flex items-center gap-2">
                            <AddEmployee />
                        </div>
                    )}
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
                        <strong>{accounts.length}</strong> kết quả
                    </div>
                    <div>
                        <AutoPagination
                            page={table.getState().pagination.pageIndex + 1}
                            pageSize={table.getPageCount()}
                            pathname={AppNavigationRoutes.MANAGE_ACCOUNTS}
                        />
                    </div>
                </div>
            </div>
        </AccountTableContext.Provider>
    );
}

export default memo(AccountTable);

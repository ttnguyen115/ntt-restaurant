export { useToast, toast } from './useToast';
export { default as useClientOnly } from './useClientOnly';
export { default as useAuth } from './useAuth';

export { useLoginMutation, useLogoutMutation } from './queries/useAuth';

export { useGuestLogin, useGuestLogout, useGetGuestOrders, useUpdateGuestOrder } from './queries/useGuest';

export { useGetAllOrders, useGetOrderDetail, useUpdateOrder } from './queries/useOrder';

export {
    useMyAccount,
    useMyAccountMutation,
    useMyPasswordMutation,
    useAddAccount,
    useUpdateAccount,
    useDeleteAccount,
    useGetAccount,
    useGetAllAccounts,
} from './queries/useAccount';

export { useMediaMutation } from './queries/useMedia';

export {
    useAddDish,
    useDeleteDish,
    useGetDish,
    useGetAllDishes,
    useGetAllDishesWithPagination,
    useUpdateDish,
} from './queries/useDish';

export {
    useCreateTable,
    useDeleteTable,
    useGetTableByNumber,
    useGetAllTables,
    useUpdateTable,
} from './queries/useTable';

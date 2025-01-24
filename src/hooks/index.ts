export { useToast, toast } from './useToast';
export { default as useClientOnly } from './useClientOnly';
export { default as useAuth } from './useAuth';

export { useLoginMutation, useLogoutMutation } from './queries/useAuth';
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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { accountApiRequest } from '@/apiRequests';

import { UpdateEmployeeAccountBodyType } from '@/schemaValidations';

export const useMyAccount = () => {
    return useQuery({
        queryKey: ['account-profile'],
        queryFn: accountApiRequest.me,
    });
};

export const useMyAccountMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe,
    });
};

export const useMyPasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword,
    });
};

export const useGetAllAccounts = () => {
    return useQuery({
        queryKey: ['accounts'],
        queryFn: accountApiRequest.getAllAccounts,
    });
};

export const useGetAccount = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['accounts', id],
        queryFn: () => accountApiRequest.getEmployee(id),
        enabled,
    });
};

export const useAddAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['accounts'],
            });
        },
    });
};

type UseUpdateAccountMutationParams = UpdateEmployeeAccountBodyType & { id: number };

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: UseUpdateAccountMutationParams) => accountApiRequest.updateEmployee(id, body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['accounts'],
                exact: true,
            });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountApiRequest.deleteEmployee,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['accounts'],
            });
        },
    });
};

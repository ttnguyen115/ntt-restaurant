import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { tableApiRequest } from '@/apiRequests';

import { UpdateTableBodyType } from '@/schemaValidations';

export const useGetAllTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: tableApiRequest.getAll,
    });
};

export const useGetTableByNumber = ({ number, enabled }: { number: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['tables', number],
        queryFn: () => tableApiRequest.getTable(number),
        enabled,
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tableApiRequest.createTable,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tables'],
            });
        },
    });
};

type UseUpdateTableBodyTypeMutationParams = UpdateTableBodyType & { number: number };

export const useUpdateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ number, ...body }: UseUpdateTableBodyTypeMutationParams) =>
            tableApiRequest.updateTable(number, body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tables'],
                exact: true,
            });
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tableApiRequest.deleteTable,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['tables'],
            });
        },
    });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { dishApiRequest } from '@/apiRequests';

import { DishListWithPaginationQueryType, UpdateDishBodyType } from '@/schemaValidations';

export const useGetAllDishes = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiRequest.getAll,
    });
};

export const useGetAllDishesWithPagination = (query: DishListWithPaginationQueryType) => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: () => dishApiRequest.getAllWithPagination(query),
    });
};

export const useGetDish = (id: number) => {
    return useQuery({
        queryKey: ['dishes', id],
        queryFn: () => dishApiRequest.getDish(id),
    });
};

export const useAddDish = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: dishApiRequest.createDish,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['dishes'],
            });
        },
    });
};

type UseUpdateDishMutationParams = UpdateDishBodyType & { id: number };

export const useUpdateDish = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: UseUpdateDishMutationParams) => dishApiRequest.updateDish(id, body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['dishes'],
                exact: true,
            });
        },
    });
};

export const useDeleteDish = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: dishApiRequest.deleteDish,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['dishes'],
            });
        },
    });
};

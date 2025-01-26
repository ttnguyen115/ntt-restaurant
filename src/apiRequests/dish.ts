import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import type {
    CreateDishBodyType,
    DishListResType,
    DishListWithPaginationQueryType,
    DishListWithPaginationResType,
    DishResType,
    UpdateDishBodyType,
} from '@/schemaValidations';

const dishApiRequest = {
    // apply ISR for homepage
    getAll: () => http.get<DishListResType>(ApiRoutes.API_DISHES, { next: { tags: ['dishes'] } }),

    getAllWithPagination: ({ page, limit }: DishListWithPaginationQueryType) =>
        http.get<DishListWithPaginationResType>(`${ApiRoutes.API_DISHES_WITH_PAGINATION}?page=${page}&limit=${limit}`),

    getDish: (id: number) => http.get<DishResType>(`${ApiRoutes.API_DISHES}/${id}`),

    createDish: (body: CreateDishBodyType) => http.post<DishResType>(ApiRoutes.API_DISHES, body),

    updateDish: (id: number, body: UpdateDishBodyType) => http.put<DishResType>(`${ApiRoutes.API_DISHES}/${id}`, body),

    deleteDish: (id: number) => http.delete<DishResType>(`${ApiRoutes.API_DISHES}/${id}`),
};

export default dishApiRequest;

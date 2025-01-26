import querystring from 'querystring';

import { Prefix } from '@/constants';

import { http } from '@/lib';

import type {
    CreateDishBodyType,
    DishListResType,
    DishListWithPaginationQueryType,
    DishListWithPaginationResType,
    DishResType,
    UpdateDishBodyType,
} from '@/schemaValidations';

const API_DISHES = Prefix.DISHES;
const API_DISHES_WITH_PAGINATION = API_DISHES + '/pagination';

const dishApiRequest = {
    // apply ISR for homepage
    getAll: () => {
        return http.get<DishListResType>(API_DISHES, { next: { tags: ['dishes'] } });
    },

    getAllWithPagination: ({ page, limit }: DishListWithPaginationQueryType) => {
        const queryString = querystring.stringify({ page, limit });
        return http.get<DishListWithPaginationResType>(`${API_DISHES_WITH_PAGINATION}?${queryString}`);
    },

    getDish: (id: number) => {
        return http.get<DishResType>(`${API_DISHES}/${id}`);
    },

    createDish: (body: CreateDishBodyType) => {
        return http.post<DishResType>(API_DISHES, body);
    },

    updateDish: (id: number, body: UpdateDishBodyType) => {
        return http.put<DishResType>(`${API_DISHES}/${id}`, body);
    },

    deleteDish: (id: number) => {
        return http.delete<DishResType>(`${API_DISHES}/${id}`);
    },
};

export default dishApiRequest;

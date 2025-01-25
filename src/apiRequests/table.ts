import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import type { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from '@/schemaValidations';

const tableApiRequest = {
    getAll: () => http.get<TableListResType>(ApiRoutes.API_TABLES),

    getTable: (number: number) => http.get<TableResType>(`${ApiRoutes.API_TABLES}/${number}`),

    createTable: (body: CreateTableBodyType) => http.post<TableResType>(ApiRoutes.API_TABLES, body),

    updateTable: (number: number, body: UpdateTableBodyType) =>
        http.put<TableResType>(`${ApiRoutes.API_TABLES}/${number}`, body),

    deleteTable: (number: number) => http.delete<TableResType>(`${ApiRoutes.API_TABLES}/${number}`),
};

export default tableApiRequest;

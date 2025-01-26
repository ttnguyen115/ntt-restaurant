import { Prefix } from '@/constants';

import { http } from '@/lib';

import type { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from '@/schemaValidations';

const API_TABLES = Prefix.TABLES;

const tableApiRequest = {
    getAll: () => {
        return http.get<TableListResType>(API_TABLES);
    },

    getTable: (number: number) => {
        return http.get<TableResType>(`${API_TABLES}/${number}`);
    },

    createTable: (body: CreateTableBodyType) => {
        return http.post<TableResType>(API_TABLES, body);
    },

    updateTable: (number: number, body: UpdateTableBodyType) => {
        return http.put<TableResType>(`${API_TABLES}/${number}`, body);
    },

    deleteTable: (number: number) => {
        return http.delete<TableResType>(`${API_TABLES}/${number}`);
    },
};

export default tableApiRequest;

import z from 'zod';

import { TableStatusValues } from '@/constants';

export const CreateTableBody = z.object({
    number: z.coerce.number().positive(),
    capacity: z.coerce.number().positive(),
    status: z.enum(TableStatusValues).optional(),
});

export type CreateTableBodyType = z.TypeOf<typeof CreateTableBody>;

export const Table = z.object({
    number: z.coerce.number(),
    capacity: z.coerce.number(),
    status: z.enum(TableStatusValues),
    token: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const TableRes = z.object({
    data: Table,
    message: z.string(),
});

export type TableResType = z.TypeOf<typeof TableRes>;

export const TableListRes = z.object({
    data: z.array(Table),
    message: z.string(),
});

export type TableListResType = z.TypeOf<typeof TableListRes>;

export const UpdateTableBody = z.object({
    changeToken: z.boolean(),
    capacity: z.coerce.number().positive(),
    status: z.enum(TableStatusValues).optional(),
});
export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>;
export const TableParams = z.object({
    number: z.coerce.number(),
});
export type TableParamsType = z.TypeOf<typeof TableParams>;
import { HttpError } from './HttpError';
import { ENTITY_ERROR_STATUS } from './StatusCode';

export type EntityErrorPayload = {
    message: string;
    errors: {
        field: string;
        message: string;
    }[];
};

export class EntityError extends HttpError {
    status: typeof ENTITY_ERROR_STATUS;

    payload: EntityErrorPayload;

    constructor({ status, payload }: { status: typeof ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
        super({ status, payload, message: 'Lỗi thực thể' });
        this.status = status;
        this.payload = payload;
    }
}

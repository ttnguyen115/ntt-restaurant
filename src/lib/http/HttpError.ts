export class HttpError extends Error {
    status: number;

    payload: {
        message: string;
        [key: string]: any;
    };

    constructor({ status, payload, message = 'Lỗi HTTP' }: { status: number; payload: any; message?: string }) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

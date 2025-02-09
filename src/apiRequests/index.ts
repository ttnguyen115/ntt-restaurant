export {
    default as authApiRequest,
    BACKEND_API as AUTH_BACKEND_API,
    ROUTE_HANDLER as AUTH_ROUTE_HANDLER,
} from './auth';

export {
    default as guestApiRequest,
    BACKEND_API as GUEST_BACKEND_API,
    ROUTE_HANDLER as GUEST_ROUTE_HANDLER,
} from './guest';

export { default as accountApiRequest } from './account';
export { default as mediaApiRequest } from './media';
export { default as dishApiRequest } from './dish';
export { default as tableApiRequest } from './table';
export { default as orderApiRequest } from './order';
export { default as indicatorApiRequest } from './indicator';
export { default as revalidateApiRequest } from './revalidate';

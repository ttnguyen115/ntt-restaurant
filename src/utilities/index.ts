export { default as isClient } from './isClient';
export { default as normalizePath } from './normalizePath';
export { default as decodeToken } from './decodeToken';
export { default as formatCurrency } from './formatCurrency';
export { default as getVietnameseDishStatus } from './getVietnameseDishStatus';
export { default as getVietnameseOrderStatus } from './getVietnameseOrderStatus';
export { default as getVietnameseTableStatus } from './getVietnameseTableStatus';
export { default as getTableLink } from './getTableLink';
export { default as removeAccents } from './removeAccents';
export { default as simpleMatchText } from './simpleMatchText';
export { default as formatDateTimeToLocaleString } from './formatDateTimeToLocaleString';
export { default as formatDateTimeToTimeString } from './formatDateTimeToTimeString';
export { default as decodeAndGetExpirationFromToken } from './decodeAndGetExpirationFromToken';
export { default as cn } from './cn';
export { default as initSocketInstance } from './initSocketInstance';
export { default as wrapServerApi } from './wrapServerApi';
export { default as generateSlugUrl } from './generateSlugUrl';
export { default as getIdFromSlugUrl } from './getIdFromSlugUrl';
export {
    getRefreshTokenFromLocalStorage,
    getAccessTokenFromLocalStorage,
    removeTokensFromLocalStorage,
    setAccessTokenToLocalStorage,
    setRefreshTokenToLocalStorage,
} from './localStorage';

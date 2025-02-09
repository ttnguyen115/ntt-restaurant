import {
    decodeToken,
    removeTokensFromLocalStorage,
    setAccessTokenToLocalStorage,
    setRefreshTokenToLocalStorage,
} from '@/utilities';

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/utilities/localStorage';

import { authApiRequest, guestApiRequest } from '@/apiRequests';

import { Role } from '@/constants';

type CallbackParams = {
    onError?: () => void;
    onSuccess?: () => void;
    force?: boolean;
};

const checkAndRefreshToken = async (param?: CallbackParams) => {
    // Whenever `checkAndRefreshToken` is called, `accessToken` and `refreshToken` are brand new
    const accessToken = getAccessTokenFromLocalStorage();
    const refreshToken = getRefreshTokenFromLocalStorage();

    // return if not have signed in
    if (!accessToken || !refreshToken) return;
    const decodedAccessToken = decodeToken(accessToken);
    const decodedRefreshToken = decodeToken(refreshToken);

    // Token expiration is calculated by epoch time (s)
    // new Date().getTime() will return epoch time (ms)
    const now = new Date().getTime() / 1000 - 1;
    if (decodedRefreshToken.exp <= now) {
        removeTokensFromLocalStorage();
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions,consistent-return
        return param?.onError && param.onError();
    }

    // The remaining time is calculated by: decodedAccessToken.exp - now
    const remainingTime = decodedAccessToken.exp - now;
    // The expiration of `accessToken` is calculated by: decodedAccessToken.exp - decodedAccessToken.iat
    const expirationTime = decodedAccessToken.exp - decodedAccessToken.iat;

    // refreshing token when the remaining time is 1/3
    if (param?.force || remainingTime < expirationTime / 3) {
        try {
            const { role } = decodedRefreshToken;
            const res =
                role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
            setAccessTokenToLocalStorage(res.payload.data.accessToken);
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
            if (param?.onSuccess) param.onSuccess();
        } catch {
            if (param?.onError) param.onError();
        }
    }
};

export default checkAndRefreshToken;

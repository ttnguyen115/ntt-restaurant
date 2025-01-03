import {
    decodeToken,
    removeTokensFromLocalStorage,
    setAccessTokenToLocalStorage,
    setRefreshTokenToLocalStorage,
} from '@/utilities';

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/utilities/localStorage';

// eslint-disable-next-line import/no-cycle
import { authApiRequest, guestApiRequest } from '@/apiRequests';

import { Role } from '@/constants';

const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        param?.onError && param.onError();
    }

    // refresh token when the remaining time is 1/3
    // The remaining time is calculated by: decodedAccessToken.exp - now
    // The expiration of `accessToken` is calculated by: decodedAccessToken.exp - decodedAccessToken.iat
    if (decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3) {
        try {
            const { role } = decodedRefreshToken;
            const res =
                role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken();
            setAccessTokenToLocalStorage(res.payload.data.accessToken);
            setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            param?.onSuccess && param.onSuccess();
        } catch {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            param?.onError && param.onError();
        }
    }
};

export default checkAndRefreshToken;

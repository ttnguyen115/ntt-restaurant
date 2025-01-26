import { cookies } from 'next/headers';

import { decodeAndGetExpirationFromToken } from '@/utilities';

import { guestApiRequest } from '@/apiRequests';

import { DEFAULT_PATH } from '@/constants';

// Route handler for getting new refresh token
export async function POST(_: Request) {
    const cookieStore = await cookies();
    const existingRefreshToken = cookieStore.get('refreshToken')?.value;

    if (!existingRefreshToken) {
        return Response.json(
            {
                message: 'Refresh token not found',
            },
            {
                status: 401,
            }
        );
    }

    try {
        const { payload } = await guestApiRequest.sRefreshToken({ refreshToken: existingRefreshToken });
        const { accessToken, refreshToken } = payload.data;
        const [decodedAccessToken, decodedRefreshToken] = decodeAndGetExpirationFromToken(accessToken, refreshToken);

        cookieStore.set('accessToken', accessToken, {
            path: DEFAULT_PATH,
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodedAccessToken.exp * 1000),
        });

        cookieStore.set('refreshToken', refreshToken, {
            path: DEFAULT_PATH,
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodedRefreshToken.exp * 1000),
        });

        return Response.json(payload);
    } catch (error: any) {
        // TODO: Add function to handle detail error for dev
        return Response.json(
            {
                message: error.message ?? 'Something went wrong!',
            },
            {
                status: 401,
            }
        );
    }
}

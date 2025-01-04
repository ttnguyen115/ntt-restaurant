import { cookies } from 'next/headers';

import { decodeAndGetExpirationFromToken } from '@/utilities';

import { authApiRequest } from '@/apiRequests';

import { DEFAULT_PATH } from '@/constants';

import { HttpError } from '@/lib';

import { LoginBodyType } from '@/schemaValidations';

// Route handler for login
export async function POST(request: Request) {
    const cookieStore = await cookies();

    const body: LoginBodyType = await request.json();

    try {
        const { payload } = await authApiRequest.sLogin(body);
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
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        }

        // TODO: Add function to handle detail error for dev
        return Response.json({
            status: 500,
            message: 'Something went wrong!',
        });
    }
}

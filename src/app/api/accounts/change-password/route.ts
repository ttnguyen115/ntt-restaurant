import { cookies } from 'next/headers';

import { decodeAndGetExpirationFromToken } from '@/utilities';

import { accountApiRequest } from '@/apiRequests';

import { DEFAULT_PATH } from '@/constants';

import { HttpError } from '@/lib';

import { ChangePasswordBodyType } from '@/schemaValidations';

// Route handler for changing password
export async function PUT(request: Request) {
    const cookieStore = await cookies();
    const body: ChangePasswordBodyType = await request.json();
    const existingAccessToken = cookieStore.get('accessToken')?.value;

    if (!existingAccessToken) {
        return Response.json(
            {
                message: 'Không tìm thấy accessToken',
            },
            {
                status: 401,
            }
        );
    }

    try {
        const { payload } = await accountApiRequest.sChangePassword(existingAccessToken, body);
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
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        }

        // TODO: Add function to handle detail error for dev
        return Response.json(
            {
                message: error.message ?? 'Something went wrong!',
            },
            {
                status: error.status ?? 500,
            }
        );
    }
}

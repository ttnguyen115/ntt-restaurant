import { cookies } from 'next/headers';

import { authApiRequest } from '@/apiRequests';

import { HttpError } from '@/lib';

// Route handler for logout
export async function POST(_: Request) {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    if (!accessToken || !refreshToken) {
        return Response.json(
            {
                message: 'Cannot receive access token and refresh token',
            },
            {
                status: 200,
            }
        );
    }

    try {
        const result = await authApiRequest.sLogout({ accessToken, refreshToken });

        return Response.json(result.payload);
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: 200,
            });
        }

        // TODO: Add function to handle detail error for dev
        return Response.json({
            status: 500,
            message: 'Something went wrong!',
        });
    }
}

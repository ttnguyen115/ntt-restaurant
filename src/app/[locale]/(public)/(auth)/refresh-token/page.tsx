import { Suspense } from 'react';

import { Metadata } from 'next';

import RefreshTokenPage from './RefreshTokenPage';

export const metadata: Metadata = {
    title: 'Refresh Token Redirect',
    description: 'Refresh Token Redirect',
    robots: {
        index: false,
    },
};

function RefreshToken() {
    return (
        <Suspense fallback={null}>
            <RefreshTokenPage />
        </Suspense>
    );
}

export default RefreshToken;

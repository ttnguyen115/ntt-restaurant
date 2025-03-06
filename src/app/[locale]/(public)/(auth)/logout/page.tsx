import { Suspense } from 'react';

import { Metadata } from 'next';

import LogoutPage from './LogoutPage';

export const metadata: Metadata = {
    title: 'Logout Redirect',
    description: 'Logout Redirect',
    robots: {
        index: false,
    },
};

function Logout() {
    return (
        <Suspense>
            <LogoutPage />
        </Suspense>
    );
}

export default Logout;

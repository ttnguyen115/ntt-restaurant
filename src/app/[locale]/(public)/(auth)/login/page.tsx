import { Suspense } from 'react';

import { setRequestLocale } from 'next-intl/server';

import { LoginFormContainer } from '@/containers';

import type { ChildrenObjectWithLocale } from '@/types';

type LoginProps = Pick<ChildrenObjectWithLocale, 'params'>;

async function Login({ params }: LoginProps) {
    const { locale } = await params;

    setRequestLocale(locale);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={null}>
                <LoginFormContainer />
            </Suspense>
        </div>
    );
}

export default Login;

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LoginFormContainer } from '@/containers';

import type { ChildrenObjectWithLocale } from '@/types';

type LoginProps = Pick<ChildrenObjectWithLocale, 'params'>;

export async function generateMetadata({ params }: LoginProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Login' });

    return {
        title: t('title'),
        description: t('description'),
    };
}

async function Login({ params }: LoginProps) {
    const { locale } = await params;

    setRequestLocale(locale);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginFormContainer />
        </div>
    );
}

export default Login;

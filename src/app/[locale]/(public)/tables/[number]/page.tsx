import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { baseOpenGraph } from '@/shard-metadata';

import type { Locale } from '@/lib';

import GuestLoginForm from './GuestLoginForm';

type Props = {
    params: Promise<{ number: string; locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, number } = await params;
    const t = await getTranslations({ locale, namespace: 'LoginGuest' });
    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/tables/${number}`;

    return {
        title: `No ${number} | ${t('title')}`,
        description: t('description'),
        openGraph: {
            ...baseOpenGraph,
            title: `No ${number} | ${t('title')}`,
            description: t('description'),
            url,
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: false,
        },
    };
}

function TableNumberPage() {
    return <GuestLoginForm />;
}

export default TableNumberPage;

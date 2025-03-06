import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { baseOpenGraph } from '@/shard-metadata';

import type { Locale } from '@/lib';

import MenuOrder from './MenuOrder';

type Props = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'GuestMenu' });
    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/guest/menu`;

    return {
        title: t('title'),
        description: t('description'),
        openGraph: {
            ...baseOpenGraph,
            title: t('title'),
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

function MenuPage() {
    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
            <MenuOrder />
        </div>
    );
}

export default MenuPage;

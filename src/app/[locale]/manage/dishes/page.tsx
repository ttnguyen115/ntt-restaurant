import { Suspense } from 'react';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { htmlToTextForMetadataDescription } from '@/utilities';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Locale } from '@/lib';

import DishTable from './DishTable';

type Props = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: 'Dishes',
    });

    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/manage/dishes`;

    return {
        title: t('title'),
        description: htmlToTextForMetadataDescription(t('description')),
        alternates: {
            canonical: url,
        },
        robots: {
            index: false,
        },
    };
}

function DishesPage() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Món ăn</CardTitle>
                        <CardDescription>Quản lý món ăn</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense>
                            <DishTable />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default DishesPage;

import { Suspense } from 'react';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { htmlToTextForMetadataDescription } from '@/utilities';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { Locale } from '@/lib';

import OrderTable from './OrderTable';

type Props = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: 'Orders',
    });

    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/manage/orders`;

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
function AccountsPage() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Đơn hàng</CardTitle>
                        <CardDescription>Quản lý đơn hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense>
                            <OrderTable />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default AccountsPage;

import { cookies } from 'next/headers';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { htmlToTextForMetadataDescription } from '@/utilities';

import { accountApiRequest } from '@/apiRequests';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { Locale } from '@/lib';

import DashboardMain from './DashboardMain';

type Props = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: 'Dashboard',
    });

    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/manage/dashboard`;

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

async function Dashboard() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value as string;

    let name = '';

    try {
        const {
            payload: { data: myAccount },
        } = await accountApiRequest.sMe(accessToken);
        name = myAccount.name;
    } catch (error: any) {
        if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Dashboard {name}</CardTitle>
                        <CardDescription>Phân tích các chỉ số</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DashboardMain />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default Dashboard;

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';

import { ChangePasswordFormContainer, UpdateProfileFormContainer } from '@/containers';

import { Badge } from '@/components/ui/badge';

import type { Locale } from '@/lib';

type Props = {
    params: Promise<{ locale: Locale }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({
        locale,
        namespace: 'Setting',
    });

    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/manage/setting`;

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: url,
        },
        robots: {
            index: false,
        },
    };
}

function Setting() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Cài đặt
                    </h1>
                    <Badge
                        variant="outline"
                        className="ml-auto sm:ml-0"
                    >
                        Owner
                    </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 md:gap-8">
                    <UpdateProfileFormContainer />
                    <ChangePasswordFormContainer />
                </div>
            </div>
        </main>
    );
}

export default Setting;

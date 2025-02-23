import Layout from '@/app/[locale]/(public)/layout';

import { defaultLocale } from '@/lib';

import { ChildrenObject } from '@/types';

function GuestLayout({ children }: Readonly<ChildrenObject>) {
    const localePromise = new Promise<{ locale: string }>((resolve) => {
        setTimeout(() => {
            resolve({ locale: defaultLocale });
        }, 0);
    });

    return <Layout params={localePromise}>{children}</Layout>;
}

export default GuestLayout;

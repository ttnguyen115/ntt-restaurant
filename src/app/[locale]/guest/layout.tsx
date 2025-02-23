import Layout from '@/app/[locale]/(public)/layout';

import { defaultLocale } from '@/lib';

import { ChildrenObject } from '@/types';

function GuestLayout({ children }: Readonly<ChildrenObject>) {
    return <Layout params={{ locale: defaultLocale }}>{children}</Layout>;
}

export default GuestLayout;

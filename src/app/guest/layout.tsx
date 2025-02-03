import Layout from '@/app/(public)/layout';

import { ChildrenObject } from '@/types';

function GuestLayout({ children }: Readonly<ChildrenObject>) {
    return <Layout>{children}</Layout>;
}

export default GuestLayout;

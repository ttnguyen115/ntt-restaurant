'use client';

import { memo, Suspense, useEffect } from 'react';

import { type ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';

type SearchParamsLoaderProps = {
    onParamsReceived: (params: ReadonlyURLSearchParams) => void;
};

function Suspendend({ onParamsReceived }: SearchParamsLoaderProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        onParamsReceived(searchParams);
    });

    return null;
}

function Suspender(props: SearchParamsLoaderProps) {
    return (
        <Suspense>
            <Suspendend {...props} />
        </Suspense>
    );
}

export default memo(Suspender);

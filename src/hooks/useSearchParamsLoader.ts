'use client';

import { useState } from 'react';

import type { ReadonlyURLSearchParams } from 'next/navigation';

function useSearchParamsLoader() {
    const [searchParams, setSearchParams] = useState<ReadonlyURLSearchParams | null>(null);

    return {
        searchParams,
        setSearchParams,
    };
}

export default useSearchParamsLoader;

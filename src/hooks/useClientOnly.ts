'use client';

import { useEffect, useState } from 'react';

/* Deprecated:
 * This hooks can be removed because of using declarative ('use client') instead
 */
export default function useClientOnly() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}

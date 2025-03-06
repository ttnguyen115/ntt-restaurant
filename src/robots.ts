import type { MetadataRoute } from 'next';

import envConfig from './config';

function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: envConfig.NEXT_PUBLIC_URL + '/sitemap.xml',
    };
}

export default robots;

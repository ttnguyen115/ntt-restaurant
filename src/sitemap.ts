import _get from 'lodash/get';
import type { MetadataRoute } from 'next';

import { dishApiRequest } from './apiRequests';
import envConfig from './config';
import { AppNavigationRoutes } from './constants';
import { Locale, locales } from './lib';
import { generateSlugUrl } from './utilities';

const staticRoutes: MetadataRoute.Sitemap = [
    {
        url: AppNavigationRoutes.DEFAULT,
        changeFrequency: 'daily',
        priority: 1,
    },
    {
        url: AppNavigationRoutes.LOGIN,
        changeFrequency: 'yearly',
        priority: 0.5,
    },
];

async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result = await dishApiRequest.getAll();
    const dishes = _get(result, 'payload.data', []);

    const localizeStaticSiteMap = locales.reduce((acc: MetadataRoute.Sitemap, locale: Locale) => {
        return [
            ...acc,
            ...staticRoutes.map((route) => ({
                ...route,
                url: `${envConfig.NEXT_PUBLIC_URL}/${locale}${route.url}`,
                lastModified: new Date(),
            })),
        ];
    }, []);
    const localizeDishSiteMap = locales.reduce((acc: MetadataRoute.Sitemap, locale: Locale) => {
        const dishesSiteMap: MetadataRoute.Sitemap = dishes.map((dish) => ({
            url: `${envConfig.NEXT_PUBLIC_URL}/${locale}/dishes/${generateSlugUrl({
                id: dish.id,
                name: dish.name,
            })}`,
            lastModified: dish.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.9,
        }));
        return [...acc, ...dishesSiteMap];
    }, []);

    return [...localizeStaticSiteMap, ...localizeDishSiteMap];
}

export default sitemap;

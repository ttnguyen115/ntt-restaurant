import { cache } from 'react';

import Image from 'next/image';

import _get from 'lodash/get';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import envConfig from '@/config';
import { baseOpenGraph } from '@/shard-metadata';
import { formatCurrency, generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from '@/utilities';

import { dishApiRequest } from '@/apiRequests';

export async function generateStaticParams() {
    const data = await wrapServerApi(() => dishApiRequest.getAll());
    const dishes = _get(data, 'payload.data') ?? [];

    return dishes.map((dish) => ({
        id: generateSlugUrl({
            name: dish.name,
            id: dish.id,
        }),
    }));
}

const getDishDetail = cache((id: number) => {
    return wrapServerApi(() => dishApiRequest.getDish(id));
});

interface Props {
    params: Promise<{ id: string; locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id: slug, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'DishDetail' });

    const id = getIdFromSlugUrl(slug);
    const data = await getDishDetail(id);
    const dish = _get(data, 'payload.data');

    if (!dish) {
        return {
            title: t('notFound'),
            description: t('notFound'),
        };
    }

    const dishIdUrl = generateSlugUrl({ name: dish.name, id: dish.id });
    const url = envConfig.NEXT_PUBLIC_URL + `/${locale}/dishes/${dishIdUrl}`;

    return {
        title: dish.name,
        description: dish.description,
        openGraph: {
            ...baseOpenGraph,
            title: dish.name,
            description: dish.description,
            url,
            images: [{ url: dish.image }],
        },
        alternates: {
            canonical: url,
        },
    };
}

async function DishDetailPage({ params }: Props) {
    const { id: slug } = await params;

    const id = getIdFromSlugUrl(slug);
    const data = await getDishDetail(id);
    const dish = _get(data, 'payload.data');

    if (!dish) {
        return (
            <div>
                <h1 className="text-2xl lg:text-3xl font-semibold">Mon an khong ton tai!</h1>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
            <div className="font-semibold">Gia: {formatCurrency(dish.price)}</div>
            <Image
                src={dish.image}
                alt={dish.name}
                width={150}
                height={150}
                className="object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md"
                title={dish.name}
            />
            <p>{dish.description}</p>
        </div>
    );
}

export default DishDetailPage;

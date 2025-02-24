import Image from 'next/image';

import _get from 'lodash/get';

import { formatCurrency, generateSlugUrl, getIdFromSlugUrl, wrapServerApi } from '@/utilities';

import { dishApiRequest } from '@/apiRequests';

interface DishDetailPageProps {
    params: Promise<{ id: string }>;
}

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

async function DishDetailPage({ params }: DishDetailPageProps) {
    const { id: slug } = await params;

    const id = getIdFromSlugUrl(slug);

    const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));
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
            />
            <p>{dish.description}</p>
        </div>
    );
}

export default DishDetailPage;

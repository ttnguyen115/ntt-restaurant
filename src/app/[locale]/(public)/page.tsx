import Image from 'next/image';

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { formatCurrency, generateSlugUrl } from '@/utilities';

import { dishApiRequest } from '@/apiRequests';

import { Prefix } from '@/constants';

import { Link } from '@/lib';

import type { DishListResType } from '@/schemaValidations';

import type { ChildrenObjectWithLocale } from '@/types';

type HomePageProps = Pick<ChildrenObjectWithLocale, 'params'>;

async function Home({ params }: HomePageProps) {
    const { locale } = await params;

    setRequestLocale(locale);

    const i18n = await getTranslations('HomePage');

    let dishes: DishListResType['data'] = [];

    try {
        const {
            payload: { data },
        } = await dishApiRequest.getAll();
        dishes = data;
    } catch {
        // TODO: add error api UI
        return <div>Something went wrong!</div>;
    }

    return (
        <div className="w-full space-y-4">
            <div className="relative">
                <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
                <Image
                    src="/banner.png"
                    width={400}
                    height={200}
                    quality={100}
                    alt="Banner"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
                    <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
                        Nhà hàng Big Boy
                        {i18n('title')}
                    </h1>
                    <p className="text-center text-sm sm:text-base mt-4">Vị ngon, trọn khoảnh khắc</p>
                </div>
            </div>
            <section className="space-y-10 py-16">
                <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {dishes.map(({ id, image, name, description, price }) => (
                        <Link
                            href={Prefix.DISHES + '/' + generateSlugUrl({ name, id })}
                            className="flex gap-4 w"
                            key={id}
                        >
                            <div className="flex-shrink-0">
                                <Image
                                    src={image}
                                    width={150}
                                    height={150}
                                    quality={100}
                                    className="object-cover rounded-md"
                                    alt={name}
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">{name}</h3>
                                <p>{description}</p>
                                <p className="font-semibold">{formatCurrency(price)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;

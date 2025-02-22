'use client';

import { memo, Suspense, useCallback } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Locale, locales, usePathname, useRouter } from '@/lib/i18n';

function SwitchLanguage() {
    const router = useRouter();
    const pathname = usePathname();

    const i18n = useTranslations('SwitchLanguage');

    const locale = useLocale();

    const handleChangeLanguage = useCallback(
        (value: Locale) => {
            router.replace(pathname, {
                locale: value,
            });
            router.refresh();
        },
        [pathname, router]
    );

    return (
        <Select
            value={locale}
            onValueChange={handleChangeLanguage}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={i18n('title')} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {locales.map((lc) => (
                        <SelectItem
                            key={lc}
                            value={lc}
                        >
                            {i18n(lc)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

function SwitchLanguageWithSuspense() {
    return (
        <Suspense fallback={null}>
            <SwitchLanguage />
        </Suspense>
    );
}

export default memo(SwitchLanguageWithSuspense);

'use client';

import { memo, useCallback } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Locale, locales, setUserLocale } from '@/lib/i18n';

function SwitchLanguage() {
    const i18n = useTranslations('SwitchLanguage');

    const locale = useLocale();

    const handleChangeLanguage = useCallback(async (value: Locale) => {
        await setUserLocale(value);
    }, []);

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

export default memo(SwitchLanguage);

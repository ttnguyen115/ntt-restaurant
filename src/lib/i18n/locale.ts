'use server';

import { cookies as NextCookies } from 'next/headers';

import { defaultLocale, type Locale } from './config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
    return NextCookies().then((cookies) => cookies.get(COOKIE_NAME)?.value || defaultLocale);
}

export async function setUserLocale(locale: Locale) {
    return NextCookies().then((cookies) => cookies.set(COOKIE_NAME, locale));
}

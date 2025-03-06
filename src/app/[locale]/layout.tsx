import { Inter as FontSans } from 'next/font/google';
import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { cn } from '@/utilities';

import { AuthProvider } from '@/contexts';

import ListenLogoutSocket from '@/components/ListenLogoutSocket';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import RefreshToken from '@/components/RefreshToken';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

import { locales, routing } from '@/lib';

import type { ChildrenObjectWithLocale } from '@/types';

import './globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

interface IMetadata {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: IMetadata) {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'Brand' });

    return {
        title: {
            template: `%s | ${t('title')}`,
            default: t('title'),
        },
    };
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

async function LocaleLayout({ children, params }: Readonly<ChildrenObjectWithLocale>) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html
            lang={locale}
            suppressHydrationWarning
        >
            <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <ReactQueryProvider>
                            <ThemeProvider
                                attribute="class"
                                defaultTheme="system"
                                enableSystem
                                disableTransitionOnChange
                            >
                                {children}
                                <Toaster />
                            </ThemeProvider>
                            <RefreshToken />
                            <ListenLogoutSocket />
                        </ReactQueryProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

export default LocaleLayout;

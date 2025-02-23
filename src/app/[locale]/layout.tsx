import { Inter as FontSans } from 'next/font/google';
import { notFound } from 'next/navigation';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { cn } from '@/utilities';

import { AuthProvider } from '@/contexts';

import ListenLogoutSocket from '@/components/ListenLogoutSocket';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import RefreshToken from '@/components/RefreshToken';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

import { routing } from '@/lib';

import type { ChildrenObject } from '@/types';

import './globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});
export const metadata: Metadata = {
    title: 'Big Boy Restaurant',
    description: 'The best restaurant in the world',
};

type LocalLayoutProps = Readonly<ChildrenObject & { params: Promise<{ locale: string }> }>;

async function LocaleLayout({ children, params }: LocalLayoutProps) {
    const { locale } = await params;

    const messages = await getMessages();

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

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

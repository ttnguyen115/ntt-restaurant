import { Inter as FontSans } from 'next/font/google';

import type { Metadata } from 'next';

import { cn } from '@/utilities';

import { AuthProvider } from '@/contexts';

import ListenLogoutSocket from '@/components/ListenLogoutSocket';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import RefreshToken from '@/components/RefreshToken';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

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

function RootLayout({ children }: Readonly<ChildrenObject>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
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
            </body>
        </html>
    );
}

export default RootLayout;

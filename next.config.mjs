import NextBundleAnalyzer from '@next/bundle-analyzer';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: (process.env.ANALYZE = 'true'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
            },
            {
                hostname: 'via.placeholder.com',
                pathname: '/**',
            },
        ],
    },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));

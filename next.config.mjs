import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

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

export default withNextIntl(nextConfig);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    async rewrites() {
        return [{ source: "/v1/metadata/:path*", destination: "/api/metadata/:path*" }];
    },
    experimental: {
        allowMiddlewareResponseBody: true,
    },
    publicRuntimeConfig: {
        NEXT_PUBLIC_INFURA_KEY: process.env?.NEXT_PUBLIC_INFURA_KEY,
        NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env?.NEXT_PUBLIC_GOOGLE_ANALYTICS,
        NEXT_PUBLIC_CHAIN_ID: process.env?.NEXT_PUBLIC_CHAIN_ID,
    },
    serverRuntimeConfig: {
        AWS_ACCESS_KEY_ID: process.env?.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env?.AWS_SECRET_ACCESS_KEY,
        AWS_REGION: process.env?.AWS_REGION,
        DATABASE_URL: process.env?.DATABASE_URL,
    },
};

module.exports = nextConfig;

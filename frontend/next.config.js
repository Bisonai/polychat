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
        NEXT_PUBLIC_MORALIS_API_KEY: process.env?.NEXT_PUBLIC_MORALIS_API_KEY,
        NEXT_PUBLIC_BE_URL: process.env?.NEXT_PUBLIC_BE_URL,
    },
    serverRuntimeConfig: {
        COINMARKETCAP_KEY: process.env?.COINMARKETCAP_KEY,
    },
};

module.exports = nextConfig;

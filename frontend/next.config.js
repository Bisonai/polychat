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
        NEXT_PUBLIC_MORALIS_API_KEY:
            "gXZwpP1VJgdkJRXnreJqUabXcRT6sHn9oijEgqnUp54bqeJSAwLz22KNUkCw2gCw",
        NEXT_PUBLIC_BE_URL: "https://api.polychat.in",
        COINMARKETCAP_KEY: "80edf3ae-f2a6-4b84-898b-23183a6571c9",
    },
    serverRuntimeConfig: {
        COINMARKETCAP_KEY: "bbf97f97-5dce-411c-80b4-29149f2e3423",
    },
};

module.exports = nextConfig;

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
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjIzNTFkMmFjLTZmYTktNGFmYy05NTRhLWVmYzRiNTE1ODNhYSIsIm9yZ0lkIjoiMzM1MjUzIiwidXNlcklkIjoiMzQ0NzAxIiwidHlwZUlkIjoiOGExYmE3Y2YtZDk0ZS00NTAyLWExMjktNzkwMjg0ZmU4ZmVhIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODQ1OTQ0NTMsImV4cCI6NDg0MDM1NDQ1M30.xOaEEQY4IdiolrQQ6aPD8O-rEVbBpPBFwwsdtVqM-5k",
        NEXT_PUBLIC_BE_URL: "https://api.polychat.in",
    },
    serverRuntimeConfig: {
        COINMARKETCAP_KEY: "bbf97f97-5dce-411c-80b4-29149f2e3423",
    },
};

module.exports = nextConfig;

import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "@styles/globalStyle";
import theme from "@src/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { PersistGate } from "redux-persist/integration/react";
import wrapper, { configureStore } from "@redux/store/configureStore";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { polygonMumbai } from "@wagmi/core/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
import { CheckLogin } from "@src/layouts/CheckLogin";
import { connecters } from "@src/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import Moralis from "moralis";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygonMumbai],
    [
        jsonRpcProvider({
            rpc(chain) {
                return {
                    http: "https://rpc-mumbai.matic.today",
                    webSocket: "https://rpc-mumbai.matic.today",
                };
            },
        }),
        publicProvider(),
    ],
);
// Set up wagmi config
const config = createConfig({
    // autoConnect: true,
    connectors: Object.values(connecters),
    publicClient,
});

if (!Moralis.Core.isStarted) {
    const settings = {
        apiKey: publicRuntimeConfig.NEXT_PUBLIC_MORALIS_API_KEY,
    };
    Moralis.start(settings);
}
const queryClient = new QueryClient();
function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const store = configureStore();
    return (
        <PersistGate loading={null} persistor={(store as any).__PERSISTOR}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig config={config}>
                        <GlobalStyle />
                        <CssBaseline />
                        <Head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Cinder</title>
                        </Head>
                        <CheckLogin>
                            <Component {...pageProps} />
                        </CheckLogin>
                    </WagmiConfig>
                </QueryClientProvider>
            </ThemeProvider>
        </PersistGate>
    );
}

export default wrapper.withRedux(MyApp);

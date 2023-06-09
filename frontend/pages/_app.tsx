import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
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
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
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
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const muiTheme = createTheme({
    palette: {
        primary: {
            main: "#8839ec",
            light: "#ebe3f4",
            dark: "#8839ec",
            contrastText: "#fff",
        },
        secondary: {
            main: "#f0f1ff",
            light: "#f0f1ff",
            dark: "#ebe3f4",
            contrastText: "#ebe3f4",
        },
    },
});
function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const store = configureStore();
    return (
        <PersistGate loading={null} persistor={(store as any).__PERSISTOR}>
            <ThemeProvider theme={(theme: Theme) => ({ ...muiTheme })}>
                <QueryClientProvider client={queryClient}>
                    <WagmiConfig config={config}>
                        <GlobalStyle />
                        <CssBaseline />
                        <Head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>polyCHAT</title>
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

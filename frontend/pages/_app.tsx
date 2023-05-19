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
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { CheckLogin } from "@src/layouts/CheckLogin";
import { connecters } from "@src/lib/utils";

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygonMumbai],
    [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY })],
);
// Set up wagmi config
const config = createConfig({
    // autoConnect: true,
    connectors: Object.values(connecters),
    publicClient,
});

function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const store = configureStore();
    return (
        <PersistGate loading={null} persistor={(store as any).__PERSISTOR}>
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
        </PersistGate>
    );
}

export default wrapper.withRedux(MyApp);

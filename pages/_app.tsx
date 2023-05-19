import React from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "@styles/globalStyle";
import theme from "@src/styles/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { PersistGate } from "redux-persist/integration/react";
import wrapper, { configureStore } from "@redux/store/configureStore";

function MyApp(props: AppProps) {
    const { Component, pageProps } = props;
    const store = configureStore();
    return (
        <PersistGate loading={null} persistor={(store as any).__PERSISTOR}>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <CssBaseline />
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Cinder</title>
                </Head>
                <Component {...pageProps} />
            </ThemeProvider>
        </PersistGate>
    );
}

export default wrapper.withRedux(MyApp);

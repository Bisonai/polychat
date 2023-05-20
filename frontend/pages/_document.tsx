import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { ServerStyleSheets } from "@mui/styles";

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                        rel="stylesheet"
                    />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <meta charSet="utf-8" />
                    <meta
                        name="keyword"
                        content="polychat,polygon,glitch,chat,blockchain,messenger"
                    />
                    <meta name="robots" content="ALL" />
                    <meta name="robots" content="index,follow" />
                    <meta name="author" content="Youngblood" />
                    <meta name="content-language" content="en" />

                    <meta name="title" content="polyCHAT" />
                    <meta name="description" content="Blockchain messenger" />
                    <meta property="og:image" content="https://polychat.in/images/logo.png" />
                    <meta property="og:image:width" content="400" />
                    <meta property="og:image:height" content="210" />
                    <meta property="og:url" content="https://polychat.in" />
                    <meta property="og:description" content="Blockchain messenger" />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="polyCHAT" />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content="polyCHAT" />
                    <meta name="twitter:description" content="Blockchain messenger" />
                    <meta name="twitter:image" content="https://polychat.in/images/logo.png" />
                    <meta name="twitter:domain" content="https://polychat.in" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const sheet = new ServerStyleSheet();
    const materialSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) =>
                    sheet.collectStyles(materialSheets.collect(<App {...props} />)),
            });

        const initialProps = await Document.getInitialProps(ctx);
        return {
            ...initialProps,
            styles: (
                <>
                    {initialProps.styles}
                    {sheet.getStyleElement()}
                </>
            ),
        };
    } finally {
        sheet.seal();
    }
};

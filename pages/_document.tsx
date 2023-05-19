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
                    <meta name="keyword" content="bagc,bayc,nft,golf" />
                    <meta name="robots" content="ALL" />
                    <meta name="robots" content="index,follow" />
                    <meta name="author" content="BISONAI" />
                    <meta name="reply-to" content="business@bisonai.com" />
                    <meta name="content-language" content="en" />

                    <meta name="title" content="BAGC-Minting" />
                    {/* <meta
                        name="description"
                        content=""
                    /> */}
                    <meta name="author" content="Bisonai" />
                    <meta
                        property="og:image"
                        content="https://minting.bagc.altava.com/images/MetaOgImage.jpg"
                    />
                    <meta property="og:image:width" content="400" />
                    <meta property="og:image:height" content="210" />
                    <meta property="og:url" content="https://minting.bagc.altava.com" />
                    {/* <meta
                        property="og:description"
                        content=""
                    /> */}
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content="BAGC-Minting" />

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content="BAGC-Minting" />
                    <meta name="twitter:description" content="" />
                    <meta
                        name="twitter:image"
                        content="https://minting.bagc.altava.com/images/MetaOgImage.jpg"
                    />
                    <meta name="twitter:domain" content="https://minting.bagc.altava.com" />
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

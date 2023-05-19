import { css } from "styled-components";
import GlobalStyleElement, { GlobalStyle } from "./globalStyle";

const colors = {
    brand: {
        neverest: "#19D2FF",
        neverestBL1: "#4CDCFF",
        neverestBL2: "#80E6FF",
        neverestBL3: "#B2F0FF",
        neverestBL4: "#E5FAFF",
        neverestBD1: "#0090B2",
        neverestBD2: "#80E6FF",
        neverestBD3: "#006780",
        neverestBD4: "#003E4C",
    },
    sub: {
        green: "#2AD4AF",
        greenL1: "#7FE6CF",
        greenL2: "#D4F7EF",
        greenD1: "#534165",
        greenD2: "#082B23",
        red: "#FF7168",
        orange: "#FFAC40",
        yellow: "#FFE261",
    },
    grayScale: {
        white: "#FFFFFF",
        grayL1: "#F6F7F9",
        grayL2: "#E7E9EF",
        grayL3: "#D7DEE5",
        gray1: "#B8C4D0",
        gray2: "#9AABBC",
        gray3: "#7B91A8",
        gray4: "#607890",
        grayD1: "#4B5E71",
        grayD2: "#374553",
        grayD3: "#232B34",
        grayD4: "#0E1215",
        black: "#0A0A0B",
    },
    background: {
        background1: "#FAFAF6",
        background2: "#FCFCF2",
        background3: "#F5F2F0",
        background4: "#F8F8F8",
        background5: "#F5F5F5",
    },
};

const spacing = {
    margin2: "2px",
    margin4: "4px",
    margin6: "6px",
    margin8: "8px",
    margin10: "10px",
    margin12: "12px",
    margin14: "14px",
    margin16: "16px",
    margin18: "18px",
    margin19: "19px",
    margin20: "20px",
    margin22: "22px",
    margin24: "24px",
    margin26: "26px",
    margin28: "28px",
    margin30: "30px",
    margin32: "32px",
    margin40: "40px",
    margin48: "48px",
    margin64: "64px",
};

const iconSpacing = {
    margin4: "4px",
    margin6: "6px",
    margin8: "8px",
    margin16: "16px",
};

const buttonSpacing = css`
    margin-right: 8px;
`;

const viewSpacing = {
    margin16: "16px",
    margin24: "24px",
    margin32: "32px",
};

const viewBottomSpacing = {
    margin64: "64px",
};

const flexCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const flexColumnFA = css`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
`;

const flexColumn = css`
    display: flex;
    flex-direction: column;
`;

const flexRowSBC = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const fontCss = {
    display4: {
        "font-size": "clamp(28px, 7.8vw, 80px)",
        "line-height": "min(1.5em, 88px)",
        "font-weight": "400",
        color: colors.grayScale.black,
        "font-family": "KOHiBaeum",
    },
    display3: {
        "font-size": "56px",
        "line-height": "min(1.5em, 61.6px)",
        "font-weight": "400",
        color: colors.grayScale.black,
        "font-family": "KOHiBaeum",
    },
    display2: {
        "font-size": "clamp(24px, 7.8vw, 48px)",
        "line-height": "72px",
        "font-weight": "400",
        color: colors.grayScale.grayD3,
        "font-family": "KOHiBaeum",
    },
    display1: {
        "font-size": "clamp(20px, 6vw, 40px)",
        "line-height": "min(1.5em, 64px)",
        "font-weight": "400",
        color: colors.grayScale.black,
        "font-family": "KOHiBaeum",
    },
    headline2: {
        "font-size": "clamp(32px, 8.89vw, 48px)",
        "line-height": "min(1.5em, 56px)",
        "font-weight": "600",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    headline1: {
        "font-size": "clamp(24px, 7vw, 40px)",
        "line-height": "min(1.5em, 46px)",
        "font-weight": "600",
        color: colors.grayScale.grayD3,
        "font-family": "Roboto",
    },
    subHead4: {
        "font-size": "clamp(15px, 4.44444vw, 28px)",
        "line-height": "min(1.5em, 32px)",
        "font-weight": "600",
        color: colors.grayScale.grayD4,
        "font-family": "Roboto",
    },
    subHead3: {
        "font-size": "clamp(16px, 4.44444vw, 24px)",
        "line-height": "min(1.5em, 28px)",
        "font-weight": "500",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    subHead2: {
        "font-size": "clamp(14px, 3.888vw, 20px)",
        "line-height": "min(1.5em, 24px)",
        "font-weight": "500",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    subHead1: {
        "font-size": "clamp(14px, 3.888vw, 16px)",
        "line-height": "min(1.5em, 19px)",
        "font-weight": "600",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    body4: {
        "font-size": "clamp(16px, 4.5vw, 28px)",
        "line-height": "44px",
        "font-weight": "400",
        color: colors.grayScale.grayD3,
        "font-family": "Roboto",
    },
    body3: {
        "font-size": "clamp(14px, 3.88vw, 24px)",
        "line-height": "min(1.5em, 32px)",
        "font-weight": "400",
        color: colors.grayScale.grayD3,
        "font-family": "Roboto",
    },
    body2: {
        "font-size": "clamp(14px, 3.88vw, 20px)",
        "line-height": "min(1.5em, 24px)",
        "font-weight": "400",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    body1: {
        "font-size": "clamp(14px, 3.88vw, 18px)",
        "line-height": "min(1.5em, 24px)",
        "font-weight": "400",
        color: colors.grayScale.grayD3,
        "font-family": "Roboto",
    },
    caption3: {
        "font-size": "16px",
        "line-height": "18.75px",
        "font-weight": "400",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    caption2: {
        "font-size": "clamp(12px, 3.33vw, 14px)",
        "line-height": "min(1.5em, 16px)",
        "font-weight": "500",
        color: colors.grayScale.black,
        "font-family": "Roboto",
    },
    caption1: {
        "font-size": "13px",
        "line-height": "16px",
        "font-weight": "400",
        color: colors.grayScale.grayD3,
        "font-family": "Roboto",
    },
};

function generateCss(styles, cssModule = css): string {
    return cssModule`${Object.entries(styles).map((style) => `${style[0]}: ${style[1]};`)}`;
}
function generateCssList(stylesList) {
    const cssList = {};
    Object.entries(stylesList).map((styles) => {
        cssList[styles[0]] = generateCss(styles[1]);
    });
    return cssList;
}

const colorPrimary = colors.brand.neverest;
const colorSecondary = colors.grayScale.gray1;

const theme = {
    name: "neverest",
    colors,
    colorPrimary,
    colorSecondary,
    flexCenter,
    flexColumnFA,
    flexRowSBC,
    flexColumn,
    spacing,
    iconSpacing,
    buttonSpacing,
    viewSpacing,
    viewBottomSpacing,
    font: generateCssList(fontCss),
    fontCss,
    GlobalStyleElement,
    GlobalStyle,
};

export default theme;

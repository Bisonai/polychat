import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const BE_URL = publicRuntimeConfig.NEXT_PUBLIC_BE_URL || "http://localhost:8888"
import axios from "axios";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
export async function fetchLatestCryptoPriceInfo() {
    try {
        const request = await axios.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            {
                params: {
                    start: 1,
                    limit: 5000,
                    convert: "USD",
                },
                headers: {
                    "X-CMC_PRO_API_KEY": serverRuntimeConfig.COINMARKETCAP_KEY,
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
        return request.data;
    } catch (error) {
        console.log(error);
    }
}

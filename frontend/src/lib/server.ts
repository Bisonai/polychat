import axios from "axios";

export async function fetchLatestCryptoPriceInfo() {
    try {
        const res = await axios.get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
            {
                params: {
                    start: 1,
                    limit: 5000,
                    convert: "USD",
                },
                headers: {
                    "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_KEY,
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );
        res.data.slice(0, 50);
        console.log(res.data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

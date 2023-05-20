import { fetchLatestCryptoPriceInfo } from "@src/lib/server";

export default async function handler(req, res) {
    try {
        const result = await fetchLatestCryptoPriceInfo();
        res.status(200).json(result.data);
    } catch (error) {
        res.status(500).json({ error: "coinmarketcap: failed to load data" });
    }
}

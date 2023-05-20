import { fetchLatestCryptoPriceInfo } from "@src/lib/server";

export default async function handler(req, res) {
    try {
        console.log(`coinmarketcap api pending.`);
        const result = await fetchLatestCryptoPriceInfo();
        console.log(`coinmarketcap api fetched: ${result}.`);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: "coinmarketcap: failed to load data" });
    }
}

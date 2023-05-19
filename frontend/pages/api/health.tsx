export default async function handler(req, res) {
    const { method } = req;
    if (method === "GET") {
        res.status(200).end("OK");
    } else {
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}

import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = {};
    res.status(200).json(data);
}

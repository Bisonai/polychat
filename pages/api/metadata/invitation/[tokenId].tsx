import { refreshMetadata } from "@src/lib/server";
import { NextApiRequest, NextApiResponse } from "next/types";

export interface ICreateAccountParams {
    address: string;
    wallet: string;
    balance: string;
    tokens: string;
    chainId: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const tokenId = (req?.query?.tokenId as string) || null;
    const result = await refreshMetadata(tokenId);
    res.status(200).json(result);
}

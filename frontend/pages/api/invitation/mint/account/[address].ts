import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { MintStatus } from "@prisma/client";

interface ProcessResult {
    statusCode: number;
    data: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { address } = req.query;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "GET") {
        result = await getPendingTransaction(address as string);
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const getPendingTransaction: (address: string) => Promise<ProcessResult> = async (address) => {
    try {
        const result = await prisma.invitation_nfts_temp.findFirst({
            select: {
                tx_hash: true,
            },
            where: {
                mint_address: address,
                mint_status: {
                    in: [MintStatus.DISPATCHED, MintStatus.PENDING],
                },
            },
        });
        const pendingTx = result?.tx_hash || null;
        return { statusCode: 200, data: { pendingTx } };
    } catch (error) {
        return { statusCode: 200, data: { pendingTx: null } };
    }
};

import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { IInviationNft } from "@src/types/common";

interface ProcessResult {
    statusCode: number;
    data: IInviationNft[] | string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { address } = req.query;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "GET") {
        result = await getAccountinvitationNFTs(address as string);
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const getAccountinvitationNFTs: (address: string) => Promise<ProcessResult> = async (address) => {
    try {
        const data = await prisma.invitation_nfts.findMany({ where: { mint_address: address } });
        return { statusCode: 200, data };
    } catch (error) {
        console.log(error);
        return { statusCode: 200, data: [] };
    }
};

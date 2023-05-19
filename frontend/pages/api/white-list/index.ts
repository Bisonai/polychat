import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { keccak256 } from "@ethersproject/keccak256";
import { IWhiteListWithTree } from "@src/types/common";

interface ProcessResult {
    statusCode: number;
    data: any;
}
export interface IFetchWLParams {
    address: string;
}

function makeLeaves(addresses: string[]): string[] {
    return addresses.map((addr) => keccak256(addr));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "GET") {
        const address = (req?.query?.address as string) || null;
        result = await getWhiteList({ address });
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const getWhiteList: (params: IFetchWLParams) => Promise<ProcessResult> = async (params) => {
    const { address } = params;
    try {
        const wlList = await prisma.white_list.findMany({ where: { address } });
        const data: IWhiteListWithTree[] = await Promise.all(
            wlList.map(async (wl) => {
                const allWL = await prisma.white_list.findMany({ where: { type: wl.type } });
                const addresses = allWL.map((wl) => wl.address);
                const leaves = makeLeaves(addresses);
                return { ...wl, leaves };
            }),
        );
        return { statusCode: 200, data };
    } catch (error) {
        return { statusCode: 500, data: error?.message || "Something went wrong" };
    }
};

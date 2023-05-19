import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { keccak256 } from "@ethersproject/keccak256";
import { IWhiteListWithTree } from "@src/types/common";
import { makeRoot, makeTree } from "@src/lib/utils";
import { rootShouldForwardProp } from "@mui/material/styles/styled";
import { SaleType, WLType } from "@prisma/client";

interface ProcessResult {
    statusCode: number;
    data: any;
}

function makeLeaves(addresses: string[]): string[] {
    return addresses.map((addr) => keccak256(addr));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "GET") {
        const wlType = (req?.query?.wlType as WLType) || null;
        if ([WLType.SS_SALE, WLType.WL_MINT].includes(wlType)) {
            result = await getMerkleRoot(wlType);
        } else {
            result = { statusCode: 406, data: "Not Acceptable" };
        }
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const getMerkleRoot: (wlType: WLType) => Promise<ProcessResult> = async (wlType) => {
    try {
        const wlList = await prisma.white_list.findMany({
            where: {
                type: wlType,
            },
        });
        const addresses = wlList.map((wl) => wl.address);
        const leaves = makeLeaves(addresses);
        const tree = makeTree(leaves);
        const root = makeRoot(tree);
        console.log(root);

        return { statusCode: 200, data: { root } };
    } catch (error) {
        return { statusCode: 500, data: error?.message || "Something went wrong" };
    }
};

import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { accounts } from "@prisma/client";

interface ProcessResult {
    statusCode: number;
    data: any;
}
export interface ICreateAccountParams {
    address: string;
    wallet: string;
    balance: string;
    tokens: string;
    chainId: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "POST") {
        const { address, wallet, balance, tokens, chainId } = req.body;
        result = await createAccount({ address, wallet, balance, tokens, chainId });
    } else if (method === "GET") {
        const { address } = req.query;
        // Type 이 나오고 간편하죠
        const result = await prisma.accounts.findUnique({
            where: {
                address: address as string,
            }
        })
        // 세부적인, 복잡한 쿼리를 작성할 수도 있습니다.
        // 타입지정을 해줘야됨
        const data: accounts = await prisma.$queryRaw`SELECT * FROM accounts WHERE address = ${address}`;
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const createAccount: (params: ICreateAccountParams) => Promise<ProcessResult> = async (params) => {
    const { address, wallet } = params;
    const transactions = [];
    try {
        transactions.push(
            prisma.accounts.upsert({
                where: {
                    address,
                },
                create: {
                    address,
                    wallet,
                },
                update: {
                    wallet,
                },
            }),
        );
        transactions.push(prisma.wallet_connect_history.create({ data: params }));
        await prisma.$transaction(transactions);
        return { statusCode: 200, data: { params } };
    } catch (error) {
        return { statusCode: 500, data: error?.message || "Something went wrong" };
    }
};

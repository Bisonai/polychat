import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";

interface ProcessResult {
    statusCode: number;
    data: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };

    if (method === "GET") {
        const now = (req?.query?.now as string) || null;
        if (now) {
            result = await getConfig(parseInt(now));
        }
    }
    const { statusCode, data } = result;
    res.status(statusCode).json(data);
}

const getConfig: (now: number) => Promise<ProcessResult> = async (now) => {
    let data = null;
    try {
        data = await prisma.website_config.findFirst({
            where: {
                start_timestamp: { lte: now },
                end_timestamp: { gt: now },
            },
        });
    } catch (error) {
        console.log(error);
    }

    return { statusCode: 200, data };
};

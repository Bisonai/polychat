import { S3_METADATA_BUCKET, S3_METADATA_DIR } from "@src/lib/constants";
import { getListObjectFromS3, getObjectFromS3, uploadObjectToS3 } from "@src/lib/server";
import { IBaseMetaData } from "@src/types/common";
import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "src/lib/db";

export interface ICreateAccountParams {
    address: string;
    wallet: string;
    balance: string;
    tokens: string;
    chainId: number;
}

const createMetadata = (tokenId: string, baycId: string) => {
    const getRowNum = ((parseInt(tokenId) - 1) % 4) + 1;
    const metaData = {
        image: `https://bagc-resource.s3.ap-northeast-2.amazonaws.com/img/inft_image_${getRowNum}.gif`,
        description: "ALTAVA | BAGC (Bored Ape Golf Club)",
        name: "Ready to BAGC",
        external_url: "https://bagc.altava.com/",
        animation_url: `https://bagc-resource.s3.ap-northeast-2.amazonaws.com/media/inft_animation_${getRowNum}.mp4`,
        attributes: [{ trait_type: "BAYC", value: baycId }],
    };
    return metaData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Get missing token id from s3
    const listObject = await getListObjectFromS3(S3_METADATA_BUCKET, S3_METADATA_DIR);
    /** Note: Token Id starts from 1 */
    const savedTokenIds = listObject
        .map((content) => {
            const splitted = content.Key.split("/");
            return splitted[splitted.length - 1];
        })
        .filter((tokenId) => !!tokenId);
    const missingRows = await prisma.token_id_mapppings.findMany({
        where: {
            token_id: { notIn: savedTokenIds },
        },
    });
    console.log("CURRENT SAVED", savedTokenIds?.length);
    console.log("MISSING", missingRows?.length);

    let result: ManagedUpload.SendData[] = [];
    if (missingRows?.length) {
        // 2. Generate the metadata with the token ids
        const metadataList = missingRows.map((row) => createMetadata(row.token_id, row.bayc_id));

        // 3. Fillout the missing metadata
        const saveRequests = metadataList.map((metadata, index) =>
            uploadObjectToS3(
                metadata,
                S3_METADATA_BUCKET,
                `${S3_METADATA_DIR}${missingRows[index].token_id}`,
            ),
        );
        result = await Promise.all(saveRequests);
    }
    console.log("SAVED", result.length);
    res.status(200).json(result);
}

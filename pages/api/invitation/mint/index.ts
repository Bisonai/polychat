import { IInviationNftTemp } from "@src/types/common";
import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "@src/lib/db";
import { BASE_URI, CONTRACTS, TRANSACTION_WAIT_CONFIRMATION } from "@src/lib/constants";
import { HolderType, MintStatus, PaymentToken, SaleType } from "@prisma/client";
import { ethers } from "ethers";
import { getProvider, refreshMetadata, sleep, updateMetadataS3 } from "@src/lib/server";

interface ProcessResult {
    statusCode: number;
    data: any;
}
export interface INftTempParams {
    mint_address: string;
    bayc_id?: string;
    bakc_id?: string;
    mayc_id?: string;
    bayc_selected: boolean;
    tx_hash: string;
    sale_type: SaleType;
    holder_type: HolderType;
    payment_token: PaymentToken;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    let result: ProcessResult = { statusCode: 405, data: "Method not allowed" };
    if (method === "POST") {
        /**
         * 1. Temporarly Save Mint Information Right After Pressing Mint Button
         */
        result = await saveInvitationNftTemp(req?.body?.nftTempList);
    } else if (method === "GET") {
        const txHash = req?.query?.txHash || null;
        if (txHash !== null) {
            result = await matchTempWithReal(txHash as string);
        } else {
            result = await matchTempWithRealAll();
        }
    }
    res.status(result.statusCode).json(result.data);
}

/**
 * Save order into Temp Table which is orders table.
 *
 * @description We're going to match with `matchTempWithReal`
 * @param nftTempList
 * @returns
 */
const saveInvitationNftTemp = async (nftTempList: INftTempParams[]): Promise<ProcessResult> => {
    const contract_address = CONTRACTS.INVITATION;
    const mint_timestamp = Math.floor(Date.now() / 1000);
    const mint_status = MintStatus.DISPATCHED;

    let data;
    try {
        if (nftTempList?.length == 0) {
            throw new Error("Temp required!");
        }
        const txList = nftTempList.map((nftTemp) => {
            const {
                mint_address,
                tx_hash,
                payment_token,
                bakc_id,
                mayc_id,
                bayc_selected,
                sale_type,
                holder_type,
            } = nftTemp;
            let bayc_id = nftTemp.bayc_id;

            if (sale_type === SaleType.YUGA_LABS) {
                if (!bayc_selected) {
                    bayc_id = null;
                }
            } else {
                bayc_id = null;
            }

            return prisma.invitation_nfts_temp.create({
                data: {
                    mint_address,
                    contract_address,
                    bayc_id: bayc_id,
                    bakc_id: bakc_id ?? null,
                    mayc_id: mayc_id ?? null,
                    bayc_selected,
                    tx_hash,
                    sale_type,
                    holder_type,
                    payment_token,
                    mint_status,
                    mint_timestamp,
                },
            });
        });
        data = await prisma.$transaction(txList);
    } catch (error) {
        data = error;
    }
    return {
        statusCode: 200,
        data,
    };
};

const getMappedBaycId = async (tokenId: string) => {
    const result = await prisma.token_id_mapppings.findFirst({
        where: { token_id: tokenId },
    });
    return result?.bayc_id || null;
};

/**
 * Get All DISPATCHED Temp NFTs (which is unmatched Order) and Try to Match with the Token ID
 *
 * @returns
 */
const matchTempWithRealAll = async (): Promise<ProcessResult> => {
    let data;
    try {
        const unmatchedTempList = await prisma.invitation_nfts_temp.findMany({
            where: {
                mint_status: MintStatus.DISPATCHED,
            },
        });
        const txHashSet = new Set(unmatchedTempList.map((temp) => temp.tx_hash));
        const txHashList = Array.from(txHashSet);
        data = await Promise.all(txHashList.map((txHash) => matchTempWithReal(txHash)));
    } catch (error) {
        data = error;
    }
    return { statusCode: 200, data };
};

/**
 * Get the token Id from onchain and Insert into the real nft table!
 *
 * @requires PLEASE_REFACTOR!
 * @param txHash
 * @returns
 */
const matchTempWithReal = async (txHash: string): Promise<ProcessResult> => {
    const provider = getProvider();
    /**
     * This TempList is actually Order List
     */
    let tempList: IInviationNftTemp[];
    try {
        if (!txHash) {
            throw new Error("Invalid TxHash");
        }
        tempList = await prisma.invitation_nfts_temp.findMany({ where: { tx_hash: txHash } });
        if (!tempList?.length) {
            return { statusCode: 200, data: null };
        }
    } catch (error) {
        return { statusCode: 200, data: error };
    }

    try {
        let receipt: ethers.providers.TransactionReceipt;
        const idxList = tempList.map((temp) => temp.idx);

        /**
         * Get transaction by tx hash
         */
        const transaction = await provider.getTransaction(txHash);
        if (!transaction?.confirmations) {
            /**
             * Transaction is still PENDING or REVERTED!
             */
            try {
                prisma.invitation_nfts_temp.updateMany({
                    data: {
                        mint_status: MintStatus.PENDING,
                    },
                    where: { idx: { in: idxList } },
                });
            } catch (error) {
                console.log(error);
            }

            // If the transaction isn't confirmed
            /**
             * Wait until transaction gets confirmed!
             * @throws Error!
             */
            try {
                /**
                 * Throw Errors when it is reverted!
                 */
                receipt = await transaction.wait(TRANSACTION_WAIT_CONFIRMATION);
            } catch (revertedError) {
                prisma.invitation_nfts_temp.updateMany({
                    data: {
                        mint_status: MintStatus.REVERTED,
                        error: revertedError,
                    },
                    where: { idx: { in: idxList } },
                });
            }
        } else {
            receipt = await provider.getTransactionReceipt(txHash);
        }
        /**
         * Get Minted Token id list of this transaction
         */
        const tokenIdList = receipt.logs
            .map((log) => parseInt(log?.topics?.[3] || null) || null)
            .filter((tokenId) => tokenId !== null);

        if (tokenIdList.length === 0) {
            throw new Error("Cannot find token id from the transaction!");
        }

        /**
         * Try to match with the orders (nft_temp)
         */
        if (tokenIdList.length !== idxList.length) {
            /**
             * If the minted Token Id amount is different with saved Order idx amount...!
             */

            throw Error(
                `Minted amount is different with order list. Token Id list: ${tokenIdList?.toString()} / Nft temp id list: ${idxList?.toString()}`,
            );
        }

        /**
         * Match Token Id with Order and save!
         */
        tempList = await Promise.all(
            tempList.map(async (temp, index) => {
                const newTemp = { ...temp };
                const { sale_type, bayc_selected } = temp;
                const token_id = `${tokenIdList[index]}`;
                let bayc_id = temp.bayc_id;
                if (sale_type === SaleType.YUGA_LABS) {
                    if (!bayc_selected) {
                        bayc_id = await getMappedBaycId(token_id);
                    }
                } else {
                    bayc_id = await getMappedBaycId(token_id);
                }
                return { ...newTemp, bayc_id };
            }),
        );
        const matchTransaction = tempList.map((temp, index) => {
            const temp_idx = temp.idx;
            const token_id = `${tokenIdList[index]}`;
            const token_uri = `${BASE_URI}${token_id}`;
            const {
                mint_address,
                bakc_id,
                mayc_id,
                bayc_id,
                bayc_selected,
                tx_hash,
                sale_type,
                holder_type,
                payment_token,
                contract_address,
                mint_timestamp,
            } = temp;

            /**
             * Insert the Inviation Nft (Finalize!)
             */
            const create = prisma.invitation_nfts.create({
                data: {
                    temp_idx,
                    mint_timestamp,
                    contract_address,
                    token_id,
                    mint_address,
                    bayc_id,
                    bakc_id,
                    mayc_id,
                    bayc_selected,
                    tx_hash,
                    token_uri,
                    sale_type,
                    holder_type,
                    payment_token,
                },
            });

            /**
             * Update the temp Invitation Nft (Order)
             */
            receipt.blockNumber;
            const update = prisma.invitation_nfts_temp.update({
                data: {
                    token_id,
                    token_uri,
                    bayc_id,
                    block_number: receipt.blockNumber,
                    tx_receipt: JSON.stringify(receipt),
                    mint_status: MintStatus.SUCCESS,
                },
                where: {
                    idx: temp_idx,
                },
            });
            return [create, update];
        });
        await prisma.$transaction(matchTransaction.flat());

        const iterateRefreshMetadata = async () => {
            for (const tokenId of tokenIdList) {
                await sleep(2000);
                await refreshMetadata(`${tokenId}`);
            }
        };
        iterateRefreshMetadata();

        try {
            if (tempList?.length && tempList?.[0]?.sale_type === SaleType.YUGA_LABS) {
                const insertTokenIdxs = tempList.map((_, index) => {
                    const token_id = `${tokenIdList[index]}`;
                    /**
                     * Insert in to `yuga_labs_mint_token_id` table to refresh metadata
                     *
                     * @since 2022-12-23
                     */
                    return prisma.yuga_labs_mint_token_id.create({
                        data: {
                            idx: parseInt(token_id),
                        },
                    });
                });
                await prisma.$transaction(insertTokenIdxs);
            }
        } catch (error) {
            console.log(error);
        }

        return { statusCode: 200, data: tokenIdList };
    } catch (e: any) {
        // Hope error doesn't comes from here!

        let error = JSON.stringify({ name: e?.name?.toString(), message: e?.message?.toString() });
        const idxList = tempList.map((temp) => temp.idx);

        try {
            await prisma.invitation_nfts_temp.updateMany({
                data: {
                    mint_status: MintStatus.ERROR,
                    error: error,
                },
                where: { idx: { in: idxList } },
            });
        } catch (updateError) {
            console.log(updateError);
            error = updateError;
        }
        return { statusCode: 200, data: error };
    }
};

import { HistoryCard } from "@components/History/HistoryCard";
import { Grid, Skeleton } from "@mui/material";
import Moralis from "moralis";
import React from "react";
import { ReactElement } from "react";
import { useAccount, useQuery } from "wagmi";
export const HistoryTemplate = (): ReactElement => {
    const { address } = useAccount();
    const transactionsQuery = useQuery(["transactions"], {
        queryFn: async () => {
            if (address === undefined) return [];

            const request = await Moralis.EvmApi.transaction.getWalletTransactions({
                chain: "0x13881",
                address,
            });
            return request.result;
        },
        select: (data) => {
            return data;
        },
    });

    const showLoading = transactionsQuery.isLoading || transactionsQuery.isFetching;
    const data = transactionsQuery.data || [];

    return (
        <Grid p={2} display="flex" flexDirection={"column"} gap={"16px"}>
            {showLoading ? (
                Array.from(Array(5).keys()).map((i, k) => {
                    return <Skeleton key={k} height={"105px"} width="100%" />;
                })
            ) : data.length > 0 ? (
                data.map((transaction) => {
                    return <HistoryCard transaction={transaction} />;
                })
            ) : (
                <div>No transactions</div>
            )}
        </Grid>
    );
};

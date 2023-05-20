import { HistoryCard } from "@components/History/HistoryCard";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
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
                    return <Skeleton key={k} height={"90px"} width="100%" variant="rectangular" />;
                })
            ) : data.length > 0 ? (
                data.map((transaction) => {
                    return <HistoryCard transaction={transaction} />;
                })
            ) : (
                <Box width={"100%"} height={"100%"} marginTop={12} textAlign={"center"}>
                    <img
                        src="/images/warning.svg"
                        alt="empty"
                        style={{ width: "100%", maxWidth: "200px" }}
                        height={"auto"}
                    />
                    <Typography variant={"h6"} align="center" color={"#d4d4d8"}>
                        No transactions found
                    </Typography>
                </Box>
            )}
        </Grid>
    );
};

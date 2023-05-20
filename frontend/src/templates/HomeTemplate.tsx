import { Box, Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ChevronRight from "@mui/icons-material/ChevronRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import { useAccount, useQuery } from "wagmi";
import { IBalance } from "@src/types";
import Moralis from "moralis";
import { EvmChain } from "moralis/common-evm-utils";
import { getTokenPercentChangeIn24h, getTokenPriceInUSD, isEmpty } from "../lib/utils";
import { formatUnits } from "ethers/lib/utils";

export const HomeTemplate = (): ReactElement => {
    const { isConnected, connector, address } = useAccount();
    const [stateAddress, setStateAddress] = useState<string>();
    const [listOfPrice, setListOfPrice] = useState();

    const requestNativeTokensQuery = useQuery(["NativeTokens", address], {
        queryFn: async () => {
            if (address) {
                const nativeBal = await Moralis.EvmApi.balance.getNativeBalance({
                    chain: EvmChain.MUMBAI,
                    address,
                });

                const quantity = parseFloat(nativeBal.result.balance.ether);

                const nativeBalance: IBalance = {
                    chainName: EvmChain.MUMBAI.name,
                    tickerName: EvmChain.MUMBAI.currency.symbol,
                    symbol: EvmChain.MUMBAI.currency.symbol,
                    quantity: quantity,
                    valueInUSD: getTokenPriceInUSD(
                        listOfPrice,
                        quantity,
                        EvmChain.MUMBAI.currency.symbol,
                    ).toFixed(4),
                    percentChange24h: getTokenPercentChangeIn24h(
                        listOfPrice,
                        EvmChain.MUMBAI.currency.symbol,
                    ),
                    formatted: "",
                };

                return nativeBalance || {};
            }
        },
    });

    const requestERC20TokensQuery = useQuery(["ERC20Tokens", address], {
        queryFn: async () => {
            if (address) {
                const ERC20Tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
                    chain: EvmChain.MUMBAI,
                    address,
                });

                const ERC20Balances = ERC20Tokens.result.map((erc20) => {
                    const quantity = parseFloat(formatUnits(erc20.amount.toBigInt()));
                    return {
                        chainName: erc20.token.chain.name,
                        tickerName: erc20.token.symbol,
                        symbol: erc20.token.symbol,
                        quantity: quantity,
                        valueInUSD: getTokenPriceInUSD(
                            listOfPrice,
                            quantity,
                            erc20.token.symbol,
                        ).toFixed(4),
                        formatted: "",
                    };
                });

                return ERC20Balances || [];
            }
        },
    });

    const ContainedButton = ({ title }): ReactElement => {
        return (
            <Button sx={{ width: 150, height: 48 }} variant="contained">
                {title}
            </Button>
        );
    };

    const PriceChangePercentage = ({ curPrice, changeRate }): ReactElement => {
        if (isEmpty(curPrice) || isEmpty(changeRate)) {
            return;
        }
        const changeInPrice = curPrice * changeRate;
        return (
            <Grid container>
                <ArrowDropUpIcon color="primary" />
                <Typography fontSize={12}>{changeRate * 100}%</Typography>
                <Typography fontSize={12}>{changeInPrice}</Typography>
            </Grid>
        );
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(stateAddress);
    };

    const TokenListTitle = (): ReactElement => {
        return (
            <Grid container sx={{ justifyContent: "space-between", mb: 1 }}>
                <Grid item>
                    <Typography fontWeight={700}>Token</Typography>
                </Grid>
                <Grid item>
                    <Grid container>
                        <Grid item>
                            <Typography fontWeight={500}>All Tokens</Typography>
                        </Grid>
                        <Grid item>
                            <ChevronRight />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const getTotalTokenBalanceInUSD = (): number | undefined => {
        if (requestNativeTokensQuery.isFetching || requestERC20TokensQuery.isFetching) {
            return;
        }
        const nativeBal = requestNativeTokensQuery.data as IBalance;
        if (isEmpty(nativeBal)) {
            return;
        }

        let balance = parseFloat(nativeBal.valueInUSD);

        (requestERC20TokensQuery.data as IBalance[]).forEach(
            (a) => (balance += parseFloat(a.valueInUSD)),
        );
        return balance;
    };

    const TokenListItem = ({ balance }: { balance: IBalance }): ReactElement => {
        if (isEmpty(balance)) {
            return <Skeleton />;
        }
        return (
            <Grid
                display={"flex"}
                flexDirection={"row"}
                sx={{
                    justifyContent: "space-between",
                    p: 2,
                    mb: 1,
                    background: "#FFFFFF",
                    borderRadius: 4,
                }}
            >
                <Grid display={"flex"} flexDirection={"row"} gap={1}>
                    <Grid display={"flex"} alignItems={"center"}>
                        <MonetizationOn sx={{ width: 32, height: 32 }} />
                    </Grid>
                    <Grid>
                        <Grid>
                            <Typography color="#848590" fontSize={12}>
                                {balance.chainName}
                            </Typography>
                            <Typography fontSize={16}>{balance.tickerName}</Typography>
                            <PriceChangePercentage
                                curPrice={balance.valueInUSD}
                                changeRate={balance.percentChange24h}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid display={"flex"} alignItems={"center"}>
                    <Grid>
                        <Typography fontSize={18} fontWeight={600}>
                            {balance.quantity}
                        </Typography>
                        <Typography fontSize={12} color="#848590">
                            ${balance.valueInUSD}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const MainDashboard = ({
        name,
        nativeBalance,
    }: {
        name: string;
        nativeBalance: IBalance;
    }): ReactElement => {
        return (
            <Container sx={{ p: 0, background: "#FFFFFF", padding: 2, borderRadius: 4 }}>
                <Typography fontSize={18} fontWeight={700}>
                    {name}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={10}>
                        <Typography
                            fontSize={12}
                            color={"#9F9FA8"}
                            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                            {stateAddress}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <ContentCopyIcon onClick={() => handleCopyAddress()} />
                    </Grid>
                </Grid>
                <Grid sx={{ mb: 2 }}>
                    <Typography fontSize={32} fontWeight={600}>
                        $ {getTotalTokenBalanceInUSD()}
                    </Typography>
                    <PriceChangePercentage
                        curPrice={nativeBalance.valueInUSD}
                        changeRate={nativeBalance.percentChange24h}
                    />
                </Grid>
                <Grid container direction="row" justifyContent={"space-evenly"}>
                    <ContainedButton title="Receive" />
                    <ContainedButton title="Withdraw" />
                </Grid>
            </Container>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch("/api/coinmarketcap").then((res) => res.json());
            setListOfPrice(data);
        };

        fetchData().catch(() => console.error);
    }, []);

    useEffect(() => {
        requestNativeTokensQuery.refetch();
        requestERC20TokensQuery.refetch();
    }, listOfPrice);

    useEffect(() => {
        if (isConnected) {
            console.log(address);
            setStateAddress(address);
        }
    }, [isConnected]);

    return (
        <Grid sx={{ p: 2, background: "#E2E2E8" }}>
            {requestNativeTokensQuery.isFetching ? (
                <Skeleton />
            ) : (
                <MainDashboard
                    name={"Bryan's Wallet"}
                    nativeBalance={requestNativeTokensQuery.data as IBalance}
                />
            )}
            <Box height={30} />
            <TokenListTitle />
            {requestNativeTokensQuery.isFetching && !requestNativeTokensQuery.data ? (
                <Skeleton height={98} />
            ) : (
                <TokenListItem key={0} balance={requestNativeTokensQuery.data as IBalance} />
            )}

            {requestERC20TokensQuery.isFetching && isEmpty(requestERC20TokensQuery.data) ? (
                <Skeleton height={98} />
            ) : (
                requestERC20TokensQuery?.data?.map((erc20Token, key) => (
                    <TokenListItem key={key} balance={erc20Token} />
                ))
            )}
        </Grid>
    );
};

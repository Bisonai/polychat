import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ChevronRight from "@mui/icons-material/ChevronRight";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import { fetchBalance } from "@wagmi/core";
import { useAccount } from "wagmi";
import { IBalance } from "@src/types";

export const HomeTemplate = (): ReactElement => {
    const { isConnected, connector, address } = useAccount();
    const [stateAddress, setStateAddress] = useState<string>();
    const [balance, setBalance] = useState<number>();
    const [symbol, setSymbol] = useState<string>();
    const [latestCryptoInfo, setLatestCryptoInfo] = useState<any>();

    const balances: IBalance[] = [
        {
            name: "MATIC",
            tickerName: "MAC",
            symbol: "",
            quantity: 10.1,
            valueInUSD: 1000,
            formatted: "",
        },
        {
            name: "MATIC",
            tickerName: "MAC",
            symbol: "",
            quantity: 10.1,
            valueInUSD: 1000,
            formatted: "",
        },
        {
            name: "MATIC",
            tickerName: "MAC",
            symbol: "",
            quantity: 10.1,
            valueInUSD: 1000,
            formatted: "",
        },
        {
            name: "MATIC",
            tickerName: "MAC",
            symbol: "",
            quantity: 10.1,
            valueInUSD: 1000,
            formatted: "",
        },
        {
            name: "MATIC",
            tickerName: "MAC",
            symbol: "",
            quantity: 10.1,
            valueInUSD: 1000,
            formatted: "",
        },
    ];

    const ContainedButton = ({ title }): ReactElement => {
        return (
            <Button sx={{ width: 150, height: 48 }} variant="contained">
                {title}
            </Button>
        );
    };

    const PriceChangePercentage = ({ curOwnPrice, curPrice }): ReactElement => {
        const changeInPercentage = (((curPrice - curOwnPrice) / curPrice) * 100).toFixed(2);
        return (
            <Grid container>
                <ArrowDropUpIcon color="primary" />
                <Typography fontSize={12}>{changeInPercentage}%</Typography>
                <Typography fontSize={12}>(+$168.03)</Typography>
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

    const TokenListItem = ({ balance }: { balance: IBalance }): ReactElement => {
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
                                {balance.name}
                            </Typography>
                            <Typography fontSize={16}>{balance.tickerName}</Typography>
                            <PriceChangePercentage curOwnPrice={100} curPrice={200} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid display={"flex"} alignItems={"center"}>
                    <Grid>
                        <Typography fontSize={18} fontWeight={600}>
                            200.5
                        </Typography>
                        <Typography fontSize={12} color="#848590">
                            $345.3
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const MainDashboard = ({ name }): ReactElement => {
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
                        $3000.55
                    </Typography>
                    <PriceChangePercentage curOwnPrice={100} curPrice={200} />
                </Grid>
                <Grid container direction="row" justifyContent={"space-evenly"}>
                    <ContainedButton title="Receive" />
                    <ContainedButton title="Withdraw" />
                </Grid>
            </Container>
        );
    };

    useEffect(() => {
        // TODO: fetch coinmarketcap market data
        console.log("initialized homepage");
        const fetchData = async () => {
            const data = await fetch("/api/coinmarketcap");
            const json = await data.json();

            console.log(`data: ${json}`);
        };

        fetchData().catch(() => console.error);
    }, []);

    useEffect(() => {
        if (isConnected) {
            console.log(address);
            setStateAddress(address);
            // .then or await
            fetchBalance({ address, chainId: 80001 }).then((res) => {
                console.log(res);
                const numBalance = parseInt(res.value.toString());
                setBalance(numBalance);
                setSymbol(res.symbol);
            });
        }
    }, [isConnected]);

    return (
        <Grid sx={{ p: 2, background: "#E2E2E8" }}>
            <MainDashboard name={"Bryan's Wallet"} />
            <Box height={30} />
            <TokenListTitle />
            {balances.map((balance: IBalance, index) => (
                <TokenListItem key={index} balance={balance} />
            ))}
        </Grid>
    );
};

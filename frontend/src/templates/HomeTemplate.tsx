import {
    Alert,
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Input,
    Modal,
    Skeleton,
    Snackbar,
    Typography,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import EditIcon from "@mui/icons-material/Edit";
import { useAccount, useQuery } from "wagmi";
import { IBalance } from "@src/types";
import Moralis from "moralis";
import { EvmChain } from "moralis/common-evm-utils";
import { getTokenPercentChangeIn24h, getTokenPriceInUSD, isEmpty } from "../lib/utils";
import { formatUnits } from "ethers/lib/utils";
import QRCode from "react-qr-code";

export const HomeTemplate = (): ReactElement => {
    const { isConnected, address } = useAccount();
    const [stateAddress, setStateAddress] = useState<string>();
    const [listOfPrice, setListOfPrice] = useState();
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [editName, setEditName] = useState<boolean>(false);
    const [openQRModal, setOpenQRModal] = useState<boolean>(false);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleQRModalTriggered = () => {
        setOpenQRModal(!openQRModal);
    };

    const handleWithdrawButtonClicked = () => {
        // TODO: Choose select users and tokens to send
    };

    const modalStyle = {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
    };

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
        navigator.clipboard
            .writeText(stateAddress)
            .then(() => setOpenSnackbar(true))
            .catch((err) => console.error(err));
    };

    const handleEditName = () => {
        console.log("editName: ", editName);
        setEditName(!editName);
    };

    const TokenListTitle = (): ReactElement => {
        return (
            <Typography sx={{ mb: 1 }} fontWeight={700}>
                Token
            </Typography>
        );
    };

    const getTotalTokenBalanceInUSD = (): number | undefined => {
        if (requestNativeTokensQuery.isFetching || requestERC20TokensQuery.isFetching) {
            return 0;
        }
        const nativeBal = requestNativeTokensQuery.data as IBalance;
        if (isEmpty(nativeBal)) {
            return 0;
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
        return nativeBalance ? (
            <Container sx={{ p: 0, background: "#FFFFFF", padding: 2, borderRadius: 4 }}>
                <Grid display={"flex"} sx={{ height: "34px", alignItems: "center" }}>
                    {/* <Typography fontSize={18} fontWeight={700} sx={{ mr: 1 }}>
                        {name}
                    </Typography> */}
                    <Input disableUnderline={!editName} defaultValue={name} />
                    {editName ? (
                        <Button
                            sx={{ width: 30, height: 22, fontSize: 10 }}
                            variant="contained"
                            onClick={handleEditName}
                        >
                            Done
                        </Button>
                    ) : (
                        <EditIcon
                            sx={{ width: 20, height: 20, m: "8px", zIndex: 0 }}
                            onClick={handleEditName}
                        />
                    )}
                </Grid>
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
                    <IconButton
                        children={<ContentCopyIcon />}
                        color="primary"
                        onClick={handleCopyAddress}
                    ></IconButton>
                    {/* <ContentCopyIcon onClick={() => handleCopyAddress()} /> */}
                </Grid>
                <Grid sx={{ mb: 2 }}>
                    <Typography fontSize={32} fontWeight={600}>
                        ${getTotalTokenBalanceInUSD()}
                    </Typography>
                    <PriceChangePercentage
                        curPrice={nativeBalance.valueInUSD}
                        changeRate={nativeBalance.percentChange24h}
                    />
                </Grid>
                <Grid container direction="row" justifyContent={"space-evenly"}>
                    <Button
                        sx={{
                            width: 140,
                            height: 48,
                            borderRadius: "8px",
                            color: "#4856FC",
                            background: "#F0F1FF",
                        }}
                        variant="contained"
                        onClick={handleQRModalTriggered}
                    >
                        {"Receive"}
                    </Button>
                    <Button
                        sx={{
                            width: 140,
                            height: 48,
                            borderRadius: "8px",
                            color: "#FFFFFF",
                            background: "#4856FC",
                        }}
                        variant="contained"
                    >
                        {"Withdraw"}
                    </Button>
                </Grid>
            </Container>
        ) : (
            <Skeleton />
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
        <Grid sx={{ p: 2, background: "#E2E2E8", height: "100vh" }}>
            {requestNativeTokensQuery.isFetching ? (
                <Skeleton height={218} />
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
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    Address is successfully copied!
                </Alert>
            </Snackbar>
            <Modal
                open={openQRModal}
                onClose={handleQRModalTriggered}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={address}
                        viewBox={`0 0 256 256`}
                    />
                </Box>
            </Modal>
        </Grid>
    );
};

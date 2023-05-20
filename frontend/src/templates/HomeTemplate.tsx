import {
    Alert,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Divider,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Modal,
    Skeleton,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";
import { ReactElement, useEffect, useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import EditIcon from "@mui/icons-material/Edit";
import { useAccount, useBalance, useQuery } from "wagmi";
import { IAccount, IBalance, IMessageType } from "@src/types";
import Moralis from "moralis";
import { Erc20Token, Erc20Value, EvmChain, EvmNft } from "moralis/common-evm-utils";
import {
    getRandomProfileImage,
    getTokenPercentChangeIn24h,
    getTokenPriceInUSD,
    isEmpty,
    sendNFT,
    sendToken,
    shortenAddress,
} from "../lib/utils";
import IconClose from "@mui/icons-material/Close";
import { formatUnits } from "ethers/lib/utils";
import QRCode from "react-qr-code";
import { createAccount, createMessage, getAccounts } from "@src/lib/api";
import { useQueryClient } from "react-query";
import { NFTList } from "@components/Channel/MessageInput";
import { title } from "process";
import React from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export const HomeTemplate = (): ReactElement => {
    const { isConnected, address } = useAccount();
    const [stateAddress, setStateAddress] = useState<string>("");
    const [account, setAccount] = useState<IAccount>(null);
    const [listOfPrice, setListOfPrice] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [editName, setEditName] = useState<boolean>(false);
    const [openQRModal, setOpenQRModal] = useState<boolean>(false);
    const [openWithdrawModal, setOpenWithdrawModal] = useState<boolean>(false);

    const textInputRef = useRef<HTMLInputElement>(null);
    const accountQueryClient = useQueryClient();

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleQRModalTriggered = () => {
        setOpenQRModal(!openQRModal);
    };

    const handleWithdrawButtonClicked = () => {
        setOpenWithdrawModal(true);
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

    const requestNativeTokensQuery = useQuery(["NativeTokens", address || ""], {
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
                        listOfPrice || [],
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
        select: (data) => {
            return data || {};
        },
    });

    const requestERC20TokensQuery = useQuery(["ERC20Tokens", address || ""], {
        queryFn: async () => {
            if (address) {
                const ERC20Tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
                    chain: EvmChain.MUMBAI,
                    address,
                });

                const ERC20Balances = ERC20Tokens.result.map((erc20) => {
                    const quantity = parseFloat(erc20.value);
                    return {
                        chainName: erc20.token.chain.name,
                        tickerName: erc20.token.symbol,
                        symbol: erc20.token.symbol,
                        quantity: quantity,
                        valueInUSD: getTokenPriceInUSD(
                            listOfPrice || [],
                            quantity,
                            erc20.token.symbol,
                        ).toFixed(4),
                        formatted: "",
                    };
                });

                return ERC20Balances || [];
            }
        },
        select: (data) => {
            return data || [];
        },
    });

    const accountsQuery = useQuery(["accounts"], {
        queryFn: getAccounts,
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

    const handleEditName = async () => {
        if (editName) {
            const newAccount: IAccount = {
                id: account.id,
                address: account.address,
                name: textInputRef.current.value,
            };
            await createAccount(newAccount)
                .then((res) => {
                    setAccount(newAccount);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
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
                        {balance.symbol === "MATIC" ? (
                            <img src={"/images/matic.webp"} width={32} height={32} />
                        ) : (
                            <MonetizationOn sx={{ width: 32, height: 32 }} />
                        )}
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
                            {parseFloat(balance.quantity.toString()).toFixed(4)}
                            &nbsp;
                            <Typography component={"span"} fontSize={16} fontWeight={600}>
                                {balance.symbol}
                            </Typography>
                        </Typography>
                        <Typography fontSize={12} color="#848590" align="right">
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
                    <Input
                        inputRef={textInputRef}
                        disableUnderline={!editName}
                        defaultValue={name}
                        sx={{ fontSize: "20px", fontWeight: 600 }}
                    />
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
                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 2, pl: 2, pt: 2 }}
                    display="flex"
                    alignItems={"center"}
                >
                    <Typography
                        fontSize={14}
                        color={"#9F9FA8"}
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                        {shortenAddress(stateAddress)}
                    </Typography>
                    <IconButton
                        children={<ContentCopyIcon sx={{ width: "20px" }} />}
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
                    <ButtonGroup>
                        <Button
                            sx={{
                                width: 160,
                                height: 48,
                                borderRadius: "8px",
                                color: "#8839ec",
                                background: "#F0F1FF",
                            }}
                            variant="contained"
                            onClick={handleQRModalTriggered}
                        >
                            {"Receive"}
                        </Button>
                        <Button
                            sx={{
                                width: 160,
                                height: 48,
                                borderRadius: "8px",
                            }}
                            variant="contained"
                            onClick={handleWithdrawButtonClicked}
                        >
                            {"Withdraw"}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Container>
        ) : (
            <Skeleton />
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch("/api/coinmarketcap")
                .then((res) => res.json())
                .catch((err) => console.error(err));
            setListOfPrice(data);
        };

        accountQueryClient.fetchQuery(["account"]).then((acc: IAccount) => {
            if (!account) {
                setAccount(acc);
            }
        });

        fetchData().catch(() => console.error);
    }, []);

    useEffect(() => {
        requestNativeTokensQuery.refetch();
        requestERC20TokensQuery.refetch();
    }, [listOfPrice]);

    useEffect(() => {
        if (isConnected) {
            setStateAddress(address);
        }
    }, [isConnected]);

    const allAccounts = accountsQuery?.data || [];

    const members = allAccounts.filter((m) => m.address?.toLowerCase() !== address?.toLowerCase());
    const accountId = allAccounts.find((m) => m.address?.toLowerCase() === address)?.id;
    return (
        <Grid sx={{ p: 2, pt: 5, background: "#E2E2E8", minHeight: "calc(100vh - 112px)" }}>
            {requestNativeTokensQuery.isFetching ? (
                <Skeleton height={218} sx={{ padding: 0 }} variant="rounded" />
            ) : (
                <>
                    <WithDrawModal
                        open={openWithdrawModal}
                        handleClose={() => setOpenWithdrawModal(false)}
                        members={members}
                        accountId={accountId}
                    />

                    <MainDashboard
                        name={account?.name}
                        nativeBalance={requestNativeTokensQuery.data as IBalance}
                    />
                </>
            )}
            <Box height={30} />
            <TokenListTitle />
            <Box marginBottom={"80px"}>
                {requestNativeTokensQuery.isFetching && !requestNativeTokensQuery.data ? (
                    <Skeleton height={98} variant="rounded" />
                ) : (
                    <TokenListItem key={0} balance={requestNativeTokensQuery.data as IBalance} />
                )}

                {requestERC20TokensQuery.isFetching && isEmpty(requestERC20TokensQuery.data) ? (
                    <Skeleton height={98} variant="rounded" />
                ) : (
                    requestERC20TokensQuery?.data?.map((erc20Token, key) => (
                        <TokenListItem key={key} balance={erc20Token} />
                    ))
                )}
            </Box>
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
                        value={address || ""}
                        viewBox={`0 0 256 256`}
                    />
                </Box>
            </Modal>
        </Grid>
    );
};

export const WithDrawModal = ({
    open,
    handleClose,
    members,
    accountId,
}: {
    open: boolean;
    handleClose: () => void;
    members: Omit<IAccount, "createdAt" | "updatedAt" | "img">[];
    accountId: number;
}): ReactElement => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Card
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    minWidth: 320,
                    borderRadius: "8px",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    pt: 2,
                    px: 2,
                    pb: 2,
                }}
            >
                <CardHeader
                    align="center"
                    title={"WithDraw"}
                    action={
                        <IconButton aria-label="close" onClick={handleClose}>
                            <IconClose />
                        </IconButton>
                    }
                />

                <CardContent>
                    <SendStepper isNFT={false} members={members} accountId={accountId} />
                </CardContent>
            </Card>
        </Modal>
    );
};

export const SendStepper = ({
    members,
    isNFT = false,
    accountId,
}: {
    members: Omit<IAccount, "createdAt" | "updatedAt" | "img">[];
    isNFT: boolean;
    accountId: number;
}) => {
    const stepMap = {
        "0": "Select User",
        "1": `${isNFT ? "Select NFT" : "Select Token"}`,
        "2": "Confirm",
    };
    const [step, setStep] = React.useState(0);
    const [selectedUser, setSelectedUser] = React.useState("");
    const [selectedNFT, setSelectedNFT] = React.useState<EvmNft | null>(null);
    const [selectedToken, setSelectedToken] = React.useState<Erc20Token | null>(null);
    const [amount, setAmount] = React.useState(0);
    const [err, setErr] = React.useState("");
    const [txHash, setTxHash] = React.useState("");
    const { address, connector } = useAccount();

    const requestNFTsQuery = useQuery(["nfts", address], {
        queryFn: async () => {
            const request = await Moralis.EvmApi.nft.getWalletNFTs({
                chain: EvmChain.MUMBAI,
                address,
            });
            return request.result || [];
        },
    });

    const requestTokensQuery = useQuery(["tokens", address], {
        queryFn: async () => {
            const request = await Moralis.EvmApi.token.getWalletTokenBalances({
                chain: EvmChain.MUMBAI,
                address,
            });
            return request.result || [];
        },
    });

    const handleNFTSelect = (nft: EvmNft) => {
        setSelectedNFT(nft);
        setStep(2);
    };

    const handleTokenSelect = (token: Erc20Token, amount: number) => {
        setSelectedToken(token);
        setAmount(amount);
        setStep(2);
    };
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (err || txHash) {
            return;
        }
        if (step === 2) {
            if (isNFT) {
                sendNFT(connector, selectedNFT as EvmNft, selectedUser)
                    .then((receipt) => {
                        // queryClient.refetchQueries(["ERC20Tokens", address || ""]);
                        toast.success("NFT sent successfully");
                        setTxHash(receipt.transactionHash);
                    })
                    .catch((err) => {
                        toast.error(err.message || "Unknown Error");
                        setErr(err.message || "Unknown Error");
                    });
            } else {
                sendToken(connector, selectedToken, amount, selectedUser)
                    .then((receipt) => {
                        queryClient.refetchQueries(["ERC20Tokens", address || ""]);
                        queryClient.refetchQueries(["NativeTokens", address || ""]);
                        toast.success("Token sent successfully");
                        setTxHash(receipt.transactionHash);
                    })
                    .catch((err) => {
                        toast.error(err.message || "Unknown Error");
                        setErr(err.message || "Unknown Error");
                    });
            }
        }
    }, [step]);
    return (
        <Box sx={{ width: "100%" }}>
            {!err && !txHash && (
                <Stepper activeStep={step} alternativeLabel>
                    {Object.entries(stepMap).map(([key, label]) => (
                        <Step key={key}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            )}
            <Divider style={{ margin: "16px" }} />
            <Grid>
                {step === 0 && (
                    <UserList
                        members={members.filter(
                            (m) => m.address?.toLowerCase() !== address?.toLowerCase(),
                        )}
                        onSelect={(value) => {
                            setSelectedUser(value);
                            setStep(1);
                        }}
                    />
                )}

                {step === 1 &&
                    (isNFT ? (
                        requestNFTsQuery.isFetching ? (
                            <Grid display={"flex"} flexDirection={"column"} gap={"8px"}>
                                {Array.from(Array(4).keys()).map((key) => (
                                    <Skeleton
                                        key={key}
                                        width={300}
                                        height={56}
                                        component={"div"}
                                        variant="rectangular"
                                    />
                                ))}
                            </Grid>
                        ) : !requestNFTsQuery?.data?.length ? (
                            <Box
                                height={56 * 4}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                            >
                                <Typography align="center">No NFTs found</Typography>
                            </Box>
                        ) : (
                            <NFTList
                                nfts={requestNFTsQuery.data || []}
                                onSelect={handleNFTSelect}
                            />
                        )
                    ) : requestTokensQuery.isFetching ? (
                        <Grid display={"flex"} flexDirection={"column"} gap={2}>
                            {Array.from(Array(4).keys()).map((key) => (
                                <Skeleton
                                    key={key}
                                    width={300}
                                    height={56}
                                    component={"div"}
                                    variant="rectangular"
                                />
                            ))}
                        </Grid>
                    ) : (
                        <TokenList
                            tokens={requestTokensQuery.data || []}
                            onSelect={handleTokenSelect}
                        />
                    ))}
                {step === 2 && (
                    <Grid
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        gap={"16px"}
                    >
                        {txHash ? (
                            <>
                                <Image
                                    width={60}
                                    height={56}
                                    src={"/images/success.svg"}
                                    alt="success"
                                />
                                <Typography fontWeight={600} fontSize={"24px"}>
                                    Success
                                </Typography>
                            </>
                        ) : err ? (
                            <>
                                <Image
                                    width={60}
                                    height={56}
                                    src={"/images/fail.svg"}
                                    alt="failed"
                                />
                                <Typography fontWeight={600} fontSize={"24px"}>
                                    Failed!
                                </Typography>
                                <Typography fontSize={"10px"}>{shortenAddress(err, 20)}</Typography>
                            </>
                        ) : (
                            <>
                                <CircularProgress thickness={5} size={60} />
                                <Typography fontWeight={600} fontSize={"24px"}>
                                    Signing...
                                </Typography>
                            </>
                        )}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export const UserList = ({
    members,
    onSelect,
}: {
    members: Omit<IAccount, "createdAt" | "updatedAt" | "img">[];
    onSelect: (value: string) => void;
}) => {
    return (
        <Box overflow={"scroll"} maxHeight={"300px"}>
            {members.map((member, key) => (
                <ListItem key={key} onClick={() => onSelect(member.address)} disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar alt={member.name} src={getRandomProfileImage(member.address)} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Typography>{member.name}</Typography>}
                            secondary={
                                <Typography variant="body2" color="text.secondary">
                                    {member?.address ? shortenAddress(member?.address || "") : ""}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </Box>
    );
};

export const TokenList = ({
    tokens,
    onSelect,
}: {
    tokens: Erc20Value[];
    onSelect: (token: Erc20Token, amount: number) => any;
}) => {
    const [selectedToken, setSelectedToken] = React.useState<Erc20Value | null>(null);
    const [amount, setAmount] = React.useState(0);
    const { address } = useAccount();
    const balanceQuery = useBalance({ address });

    const handleSendToken = () => {
        if (!selectedToken) {
            return;
        } else if (!amount) {
            return;
        } else if (amount < 0) {
            return;
        } else if (amount > parseFloat(selectedToken.value)) {
            return;
        }
        onSelect(selectedToken.token, amount);
    };
    const disabled =
        !selectedToken ||
        !amount ||
        amount <= BigInt(0) ||
        amount > parseFloat(selectedToken.value);

    return (
        <List
            dense
            sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflow: "scroll",
                maxHeight: "300px",
            }}
        >
            {selectedToken ? (
                <Grid display={"flex"} flexDirection={"column"} gap={"8px"}>
                    <Input
                        endAdornment={
                            <InputAdornment position="end">
                                {selectedToken.token.symbol}
                            </InputAdornment>
                        }
                        type="number"
                        placeholder="Amount"
                        inputProps={{
                            "aria-label": selectedToken.token.symbol,
                            max: parseFloat(selectedToken.value),
                            min: 0,
                        }}
                        onChange={(e) => {
                            setAmount(Number(e.target.value));
                        }}
                    />
                    <Button
                        variant="outlined"
                        size="large"
                        color="primary"
                        sx={{ height: "56px", borderRadius: "8px" }}
                        fullWidth
                        disabled={disabled}
                        onClick={handleSendToken}
                    >
                        SEND
                    </Button>
                </Grid>
            ) : (
                <>
                    {balanceQuery.data && (
                        <ListItem
                            onClick={() =>
                                setSelectedToken(
                                    Erc20Value.create(balanceQuery?.data?.value, {
                                        decimals: 18,
                                        token: {
                                            decimals: 18,
                                            name: "MATIC",
                                            chain: EvmChain.MUMBAI,
                                            symbol: balanceQuery?.data?.symbol,
                                            contractAddress:
                                                "0x0000000000000000000000000000000000001010",
                                        },
                                    }),
                                )
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt={"MATIC"} src={"/images/matic.webp"} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <>
                                            <Typography>{"MATIC"}</Typography>
                                            <Typography>
                                                {parseFloat(
                                                    formatUnits(balanceQuery?.data?.value),
                                                ).toFixed(3)}{" "}
                                                {balanceQuery?.data?.symbol}
                                            </Typography>
                                        </>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {shortenAddress(
                                                "0x0000000000000000000000000000000000001010",
                                            )}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    )}
                    {tokens.length &&
                        tokens.map((erc20Value, key) => {
                            console.log("erc20Value", erc20Value);
                            const token = erc20Value.token;
                            // ERC20 token balance in Eth
                            const balance = erc20Value.value as any as string;

                            return (
                                <ListItem
                                    onClick={() => setSelectedToken(erc20Value)}
                                    key={key}
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            {token.thumbnail ? (
                                                <Avatar alt={token.name} src={token.thumbnail} />
                                            ) : (
                                                <MonetizationOn sx={{ width: 32, height: 32 }} />
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <Typography>{token.name}</Typography>
                                                    <Typography>
                                                        {parseFloat(balance).toFixed(3)}
                                                        {token.symbol}
                                                    </Typography>
                                                </>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {shortenAddress(
                                                        token.contractAddress?.toString(),
                                                    )}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                </>
            )}
        </List>
    );
};

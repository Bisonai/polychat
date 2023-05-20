import * as React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import IconSend from "@mui/icons-material/Send";
import IconClose from "@mui/icons-material/Close";
import IconAdd from "@mui/icons-material/Add";
import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    CircularProgress,
    Divider,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    InputAdornment,
    InputBase,
    InputLabel,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Modal,
    Radio,
    RadioGroup,
    Select,
    Skeleton,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import { IAccount } from "@src/types";
import { Connector, useAccount, useBalance, useQuery } from "wagmi";
import Moralis from "moralis";
import { Erc20Token, Erc20Value, EvmChain, EvmNft } from "moralis/common-evm-utils";
import { sendNFT, sendToken, shortenAddress } from "@src/lib/utils";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { usePublicClient, useWalletClient } from "wagmi";
import Image from "next/image";
import axios from "axios";
import { ethers } from "ethers";

export default function MessageInput({ channelId }: { channelId: string }) {
    const [open, setOpen] = React.useState(false);
    const [sendType, setSendType] = React.useState("");
    const handleSendMessage = (event: any) => {
        // Check If it is shift + enter
        if (event.shiftKey && event.key === "Enter") {
            return;
        }
        // TODO:Send Message
        console.log(event.target.value);
    };

    const handleOpenModal = () => {
        setOpen(true);
        setSendType("");
    };
    const handleClose = () => {
        setOpen(false);
        setSendType("");
    };

    const handleSelectSendType = (sendType: string) => {
        setSendType(sendType);
    };
    let title = "";
    if (sendType === "NFT") {
        title = "Send NFT";
    } else if (sendType === "Token") {
        title = "Send Token";
    } else {
        title = "Select Type";
    }
    return (
        <>
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
                        title={title}
                        action={
                            <IconButton aria-label="close" onClick={handleClose}>
                                <IconClose />
                            </IconButton>
                        }
                    />

                    <CardContent>
                        {sendType ? (
                            <SendStepper isNFT={sendType === "NFT"} channelId={channelId} />
                        ) : (
                            <ButtonGroup orientation="vertical" variant="outlined" fullWidth>
                                <Button
                                    size="large"
                                    color="primary"
                                    sx={{ height: "56px", borderRadius: "8px" }}
                                    onClick={() => handleSelectSendType("NFT")}
                                    fullWidth
                                >
                                    Send NFT
                                </Button>
                                <Button
                                    size="large"
                                    color="primary"
                                    sx={{ height: "56px", borderRadius: "8px" }}
                                    onClick={() => handleSelectSendType("Token")}
                                    fullWidth
                                >
                                    Send Token
                                </Button>
                            </ButtonGroup>
                        )}
                    </CardContent>
                </Card>
            </Modal>

            <Paper
                component="form"
                sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
            >
                <IconButton sx={{ p: "10px" }} aria-label="Send Assets" onClick={handleOpenModal}>
                    <IconAdd />
                </IconButton>
                <InputBase
                    id="outlined-multiline-flexible"
                    multiline
                    maxRows={2}
                    fullWidth
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage(e);
                        }
                    }}
                />
                <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
                    <IconSend />
                </IconButton>
            </Paper>
        </>
    );
}

export const SendStepper = ({ channelId, isNFT }: { channelId: string; isNFT: boolean }) => {
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
    // TODO: Get Participants of the channel
    const members: IAccount[] = [
        {
            id: 1,
            name: "Baram",
            imgUrl: "/static/images/avatar/1.jpg",
            address: "0x2031832e54a2200bF678286f560F49A950DB2Ad5",
            polygonId: "0x2031832e54a2200bF678286f560F49A950DB2Ad5",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
        {
            id: 2,
            name: "Bryan",
            imgUrl: "/static/images/avatar/2.jpg",
            polygonId: "0x5aEcC9617cC5A4De21BaFFFEa16153eeB7A2ac14",
            address: "0x5aEcC9617cC5A4De21BaFFFEa16153eeB7A2ac14",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
        {
            id: 3,
            name: "Cindy Baker",
            imgUrl: "/static/images/avatar/3.jpg",
            polygonId: "0x388C818CA8B9251b393131C08a736A67ccB19291",
            address: "0x388C818CA8B9251b393131C08a736A67ccB39297",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
    ];
    const { address, connector } = useAccount();

    const requestNFTsQuery = useQuery(["nfts", address], {
        queryFn: async () => {
            const request = await Moralis.EvmApi.nft.getWalletNFTs({
                chain: EvmChain.MUMBAI,
                address,
            });
            console.log(request.result);
            return request.result || [];
        },
    });

    const requestTokensQuery = useQuery(["tokens", address], {
        queryFn: async () => {
            const request = await Moralis.EvmApi.token.getWalletTokenBalances({
                chain: EvmChain.MUMBAI,
                address,
            });
            console.log(request.result);
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
    React.useEffect(() => {
        if (err || txHash) {
            return;
        }
        if (step === 2) {
            if (isNFT) {
                sendNFT(connector, selectedNFT as EvmNft, selectedUser)
                    .then((result) => {
                        console.log(result);
                        // TODO: Send Tx Hash
                        setTxHash(result.transactionHash);
                    })
                    .catch((err) => {
                        setErr(err.message || "Unknown Error");
                    });
            } else {
                sendToken(connector, selectedToken, amount, selectedUser)
                    .then((result) => {
                        console.log(result);
                        // TODO: Send Tx Hash
                        setTxHash(result.transactionHash);
                    })
                    .catch((err) => {
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
                    <RatioList
                        title=""
                        options={members.reduce((acc, member) => {
                            acc[member.address] = member.name;
                            return acc;
                        }, {})}
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

export const RatioList = ({
    title,
    onSelect,
    options,
}: {
    title: string;
    onSelect: (value: string) => void;
    options: { [value: string]: string };
}) => {
    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">{title}</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                {Object.entries(options).map(([key, value]) => (
                    <FormControlLabel
                        key={key}
                        value={key}
                        control={<Radio />}
                        label={value}
                        onClick={() => onSelect(key)}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

export const NFTList = ({
    nfts,
    onSelect,
}: {
    nfts: EvmNft[];
    onSelect: (value: EvmNft) => void;
}) => {
    const [nftImages, setNftImages] = React.useState<{ [key: string]: string }>({});
    React.useEffect(() => {
        Promise.all(
            nfts.map((nft) => {
                return axios
                    .get(nft.tokenUri)
                    .then((res) => {
                        return { nft, image: res.data?.image };
                    })
                    .catch((err) => ({ nft, image: "" }));
            }),
        ).then((nfts) => {
            const images = nfts.reduce((acc, nft) => {
                acc[nft.nft.tokenAddress + nft.nft.tokenId.toString()] = nft.image;
                return acc;
            }, {});
            setNftImages(images);
        });
    }, []);
    return (
        <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
            {nfts.map((nft, key) => (
                <ListItem key={key} onClick={() => onSelect(nft)} disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar
                                alt={nft.name}
                                src={nftImages[nft.tokenAddress + nft.tokenId.toString()]}
                            />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Typography>
                                    {nft.name} #{nft.tokenId}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body2" color="text.secondary">
                                    {shortenAddress(nft.tokenAddress.toJSON())}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
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
        } else if (amount > Number(selectedToken.amount)) {
            return;
        }
        onSelect(selectedToken.token, amount);
    };
    const disabled =
        selectedToken === null ||
        !amount ||
        amount <= BigInt(0) ||
        amount > Number(formatUnits(selectedToken.amount.toBigInt()));

    return (
        <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
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
                            max: formatUnits(selectedToken.amount.toBigInt()),
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
                                    <Avatar alt={"ETH"} src={balanceQuery?.data?.symbol} />
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
                    {tokens.map((erc20Value, key) => {
                        const token = erc20Value.token;
                        return (
                            <ListItem
                                onClick={() => setSelectedToken(erc20Value)}
                                key={key}
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar alt={token.name} src={token.thumbnail} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <>
                                                <Typography>{token.name}</Typography>
                                                <Typography>
                                                    {parseFloat(
                                                        formatUnits(erc20Value.amount.toBigInt()),
                                                    ).toFixed(3)}{" "}
                                                    {token.symbol}
                                                </Typography>
                                            </>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {shortenAddress(token.contractAddress.toJSON())}
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

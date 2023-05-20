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
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    InputBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Modal,
    Radio,
    RadioGroup,
    Skeleton,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";
import { IAccount } from "@src/types";
import { Connector, useAccount, useQuery } from "wagmi";
import Moralis from "moralis";
import { EvmNft } from "moralis/common-evm-utils";
import { sendNFT, shortenAddress } from "@src/lib/utils";

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
                        title={
                            !sendType
                                ? "Select Type"
                                : sendType === "NFT"
                                ? "Send NFT"
                                : "Send Token"
                        }
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
        "0": "Select User To Send",
        "1": `${isNFT ? "Select NFT" : "Select Token"}`,
        "2": "Confirm",
    };
    const [step, setStep] = React.useState(0);
    const [selectedUser, setSelectedUser] = React.useState("");
    const [selectedNFT, setSelectedNFT] = React.useState<EvmNft | null>(null);

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
            polygonId: "0xc34b48Bed1e9DdaB6DD98264D17D7FC7EF595077",
            address: "0xc34b48Bed1e9DdaB6DD98264D17D7FC7EF595077",
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
                chain: "0x13881",
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

    React.useEffect(() => {
        if (step === 2) {
            console.log(selectedUser, selectedNFT);
            // TODO: Check if the user has the NFT
            sendNFT(connector, selectedNFT as EvmNft, selectedUser);
        }
    }, [step]);
    return (
        <Box sx={{ width: "100%" }}>
            <Stepper activeStep={step} alternativeLabel>
                {Object.entries(stepMap).map(([key, label]) => (
                    <Step key={key}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
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
                            console.log(value);
                            setSelectedUser(value);
                            setStep(1);
                        }}
                    />
                )}

                {step === 1 &&
                    (requestNFTsQuery.isFetching ? (
                        <Skeleton />
                    ) : (
                        <NFTList nfts={requestNFTsQuery.data || []} onSelect={handleNFTSelect} />
                    ))}
                {step === 2 && (
                    <Grid
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        gap={"16px"}
                    >
                        <CircularProgress thickness={5} size={60} />
                        <Typography fontWeight={600} fontSize={"24px"}>
                            Signing...{" "}
                        </Typography>
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
    console.log(nfts);

    return (
        <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
            {nfts.map((nft, key) => (
                <ListItem key={key} onClick={() => onSelect(nft)} disablePadding>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar alt={nft.name} src={nft.tokenUri} />
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

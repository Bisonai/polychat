import React, { useEffect } from "react";
import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import { IMessage } from "@src/types";
import { useAccount } from "wagmi";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import InsertEmoticonTwoToneIcon from "@mui/icons-material/InsertEmoticonTwoTone";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";
import { getRandomProfileImage, shortenAddress } from "@src/lib/utils";
import Moralis from "moralis";
import axios from "axios";
import { EvmAddress, EvmChain } from "moralis/common-evm-utils";

type IMessageGroup = IMessage[][];

export const MessageList = ({
    messages,
    isFetching,
}: {
    messages: IMessage[];
    isFetching: boolean;
}) => {
    const messageList: IMessageGroup = [];
    messages
        .sort((a: IMessage, b: IMessage) => Number(a.id) - Number(b.id))
        .reduce((prev: IMessage, curr: IMessage) => {
            // 첫 번째 메시지
            if (prev === null) {
                messageList.push([curr]);
                return curr;
            }
            // 이전 메시지와 현재 메시지의 주인이 같다면
            if (prev.accountAddress?.toLowerCase() === curr.accountAddress?.toLowerCase()) {
                const lastIndex = messageList.length - 1;
                messageList[lastIndex].push(curr);
            } else {
                messageList.push([curr]);
            }
            return curr;
        }, null);
    const { address } = useAccount();

    return (
        <Box position={"relative"} padding={4} paddingBottom={"80px"} id="message-list">
            {isFetching ? (
                <Box width={"100%"} display={"flex"} justifyContent={"center"} marginTop={20}>
                    <CircularProgress size={100} />
                </Box>
            ) : !messageList.length ? (
                <Box
                    width={"100%"}
                    height={"100%"}
                    marginTop={12}
                    textAlign={"center"}
                    justifyContent={"center"}
                    display={"flex"}
                    alignItems={"center"}
                    flexDirection={"column"}
                >
                    <Grid width={100} height={100} pb={2}>
                        <InsertEmoticonTwoToneIcon
                            sx={{
                                color: "#8839ec",
                                textAlign: "center",
                                width: "100%",
                                height: "auto",
                                opacity: 0.3,
                            }}
                        />
                    </Grid>
                    <Typography variant={"h6"} align="center" color={"#d4d4d8"}>
                        No messages found. <br />
                        You can start a conversation by sending a message.
                    </Typography>
                </Box>
            ) : (
                <>
                    {messageList.map((msgs, key) => {
                        const side = msgs[0].accountAddress === address ? "right" : "left";
                        const name = msgs[0].account.name;
                        const shortAddress = shortenAddress(
                            msgs[0].accountAddress?.toLowerCase(),
                            3,
                        );
                        const imgUrl =
                            location.protocol +
                            "//" +
                            location.host +
                            getRandomProfileImage(msgs[0].accountAddress);
                        return (
                            <Grid position={"relative"}>
                                {side === "left" ? (
                                    <>
                                        {name ? (
                                            <Typography
                                                py={2}
                                                variant="body1"
                                                fontSize={"14px!important"}
                                                component={"span"}
                                            >
                                                {name}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                py={2}
                                                variant="body2"
                                                fontSize={"11px!important"}
                                                color={"#848590"}
                                                component={"span"}
                                            >
                                                ({shortAddress})
                                            </Typography>
                                        )}
                                    </>
                                ) : null}

                                <ChatMsg
                                    avatar={imgUrl || name || shortAddress}
                                    side={side}
                                    messages={msgs.map((m) => {
                                        const {
                                            id,
                                            channelId,
                                            accountId,
                                            accountAddress,
                                            contractAddress,
                                            messageType,
                                            txHash,
                                            tokenValue,
                                            nftTokenId,
                                            nftTokenUri,
                                            message,
                                            createdAt,
                                        } = m;
                                        return (
                                            <Box className="textBox">
                                                {messageType === "text" && (
                                                    <Typography>{m.message}</Typography>
                                                )}
                                                {messageType === "token" && (
                                                    <TokenTransferCard
                                                        contractAddress={contractAddress}
                                                        txHash={txHash}
                                                        from={accountAddress}
                                                        amount={tokenValue}
                                                    />
                                                )}
                                                {messageType === "nft" && (
                                                    <NFTTransferCard
                                                        contractAddress={contractAddress}
                                                        tokenId={nftTokenId}
                                                        nftTokenUri={nftTokenUri || null}
                                                        txHash={txHash}
                                                        from={accountAddress}
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                />
                            </Grid>
                        );
                    })}
                </>
            )}
        </Box>
    );
};

export default function NFTTransferCard({
    nftTokenUri,
    tokenId,
    contractAddress,
    txHash,
    from,
}: {
    nftTokenUri: string;
    tokenId: string;
    contractAddress: string;
    txHash: string;
    from: string;
}) {
    const [metadata, setMetadata] = React.useState<any>({});
    const setNFTMetadata = async (nftTokenUri: string) => {
        axios.get(nftTokenUri).then((res) => {
            setMetadata(res.data);
        });
    };
    useEffect(() => {
        if (nftTokenUri && nftTokenUri != "0") {
            setNFTMetadata(nftTokenUri);
        } else {
            try {
                Moralis.EvmApi.nft
                    .reSyncMetadata({
                        chain: EvmChain.MUMBAI,
                        address: contractAddress,
                        tokenId: tokenId,
                    })
                    .then((res) => {
                        Moralis.EvmApi.nft
                            .getMultipleNFTs({
                                chain: EvmChain.MUMBAI,
                                tokens: [{ tokenAddress: contractAddress, tokenId: tokenId }],
                            })
                            .then((res) => {
                                if (res?.result?.length) {
                                    setMetadata(res?.result[0]?.metadata);
                                }
                            });
                    });
            } catch (error) {
                console.log("error", error);
            }
        }
    }, []);
    const image =
        (metadata?.image && metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")) ||
        "https://via.placeholder.com/150";
    const title = metadata?.name || "NFT";
    const description =
        metadata?.description || `${shortenAddress(from)} has sent ${title} #${tokenId}`;
    return (
        <Card sx={{ width: 200 }}>
            <CardMedia component="img" alt={title} height="140" image={image} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title} #{tokenId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                    target="_blank"
                >
                    View Transaction
                </Button>
            </CardActions>
        </Card>
    );
}

export const TokenTransferCard = ({
    contractAddress,
    txHash,
    from,
    amount,
}: {
    contractAddress: string;
    txHash: string;
    from: string;
    amount: number;
}) => {
    const [metadata, setMetadata] = React.useState<any>({});
    useEffect(() => {
        try {
            Moralis.EvmApi.token
                .getTokenMetadata({
                    chain: EvmChain.MUMBAI,
                    addresses: [contractAddress],
                })
                .then((res) => {
                    if (res?.raw?.length) {
                        setMetadata(res.raw[0]);
                    }
                })
                .catch((err) => {
                    console.log("err", err);
                });
        } catch (error) {
            console.log("error", error);
        }
    }, []);
    return (
        <Card sx={{ width: 200 }}>
            <CardContent>
                <div style={{ textAlign: "center", paddingBottom: "4px" }}>
                    <CurrencyBitcoinIcon
                        style={{
                            width: 100,
                            height: 100,
                        }}
                    />
                </div>
                <Typography gutterBottom variant="h5" component="div">
                    {amount} {metadata?.symbol || "MATIC"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {shortenAddress(from)} has sent{" "}
                    <b>
                        {amount} {metadata?.symbol || "MATIC"}
                    </b>
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                    target="_blank"
                >
                    View Transaction
                </Button>
            </CardActions>
        </Card>
    );
};

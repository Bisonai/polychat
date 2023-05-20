import React from "react";
import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import { IMessage } from "@src/types";
import { useAccount } from "wagmi";
import { Avatar, Grid, Typography } from "@mui/material";
import { shortenAddress } from "@src/lib/utils";

type IMessageGroup = IMessage[][];

export const MessageList = ({ messages }: { messages: IMessage[] }) => {
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
            if (prev.accountAddress === curr.accountAddress) {
                const lastIndex = messageList.length - 1;
                messageList[lastIndex].push(curr);
            } else {
                messageList.push([curr]);
            }
            return curr;
        }, null);
    const { address } = useAccount();
    console.log(messageList);
    return (
        <div>
            {!messageList.length ? (
                "No messages yet."
            ) : (
                <>
                    {messageList.map((msg, key) => {
                        const side = msg[0].accountAddress === address ? "right" : "left";
                        const name = shortenAddress(msg[0].accountAddress.toLowerCase(), 3);
                        return (
                            <Grid position={"relative"}>
                                {side === "left" ? (
                                    <Typography
                                        py={1}
                                        variant="body2"
                                        fontSize={"11px!important"}
                                        color={"#848590"}
                                    >
                                        ({name})
                                    </Typography>
                                ) : null}

                                <ChatMsg
                                    avatar={<Avatar alt={name} src={name} />}
                                    side={side}
                                    messages={msg.map((m) => m.message)}
                                />
                            </Grid>
                        );
                    })}
                </>
            )}
        </div>
    );
};

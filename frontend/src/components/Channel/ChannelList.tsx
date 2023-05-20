import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { IChannel } from "@src/types";
import { UseQueryResult } from "react-query";
import { Box, Grid, Skeleton } from "@mui/material";
import { getRandomProfileImage, shortenAddress } from "@src/lib/utils";
import { useAccount } from "wagmi";

export default function ChannelList({
    channelQuery,
}: {
    channelQuery: UseQueryResult<IChannel[], unknown>;
}) {
    const router = useRouter();
    const channelList = channelQuery.data || [];
    const handleChannelClick = (chatId: number) => {
        router.push(`/channel/${chatId}`);
    };
    const { address } = useAccount();
    return (
        <List sx={{ width: "100%", bgcolor: "background.paper", paddingBottom: "100px" }}>
            {channelQuery.isFetching ? (
                <Grid display={"flex"} flexDirection={"column"} gap={1}>
                    {Array.from(Array(8).keys()).map((key) => (
                        <Skeleton
                            key={key}
                            width={"100%"}
                            height={60}
                            component={"div"}
                            variant="rectangular"
                        />
                    ))}
                </Grid>
            ) : !channelList?.length ? (
                <Typography variant={"h6"} align="center">
                    No channels found
                </Typography>
            ) : (
                channelList?.map((chatList, key) => (
                    <>
                        <ListItem
                            style={{
                                cursor: "pointer",
                            }}
                            alignItems="flex-start"
                            key={key}
                            onClick={() => handleChannelClick(chatList.id)}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt={chatList.channelName}
                                    src={getRandomProfileImage(chatList?.members?.[0]?.address)}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={chatList.channelName || "No name"}
                                secondary={
                                    <Box>
                                        <Typography
                                            sx={{ display: "inline" }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {chatList.members
                                                .filter(
                                                    (member) =>
                                                        member.address?.toLowerCase() !==
                                                        address?.toLowerCase(),
                                                )
                                                .map(
                                                    (member) =>
                                                        member.name ||
                                                        shortenAddress(member.address, 2),
                                                )
                                                .join(", ")}
                                        </Typography>
                                        {` — ${chatList.lastMessage || "(empty chat)"}`}
                                    </Box>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </>
                ))
            )}
        </List>
    );
}

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
import moment from "moment";

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
                                    <Grid container justifyContent={"space-between"}>
                                        <Box textOverflow={"ellipsis"} display={"flex"}>
                                            <Typography
                                                sx={{ display: "inline-block" }}
                                                component="div"
                                                variant="body2"
                                                color="text.primary"
                                                maxWidth={"100px"}
                                                textOverflow={"ellipsis"}
                                                overflow={"hidden"}
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
                                            <Typography
                                                sx={{ display: "inline-block" }}
                                                component="div"
                                                maxWidth={"250px"}
                                                variant="body2"
                                            >
                                                {` — ${chatList.lastMessage || "(empty chat)"}`}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }} maxWidth={"150px"} />
                                        <Box>
                                            <Typography
                                                sx={{ display: "inline" }}
                                                component="span"
                                                variant="body2"
                                                color={"#9e9e9e"}
                                            >
                                                {chatList.lastMessageAt &&
                                                    moment(chatList.lastMessageAt).fromNow()}
                                            </Typography>
                                        </Box>
                                    </Grid>
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

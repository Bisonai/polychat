import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { IAccount, IChannel } from "@src/types";

export default function Channel() {
    const router = useRouter();
    const members: IAccount[] = [
        {
            id: 1,
            name: "Ali Connors",
            imgUrl: "/static/images/avatar/1.jpg",
            address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            polygonId: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
        {
            id: 2,
            name: "Travis Howard",
            imgUrl: "/static/images/avatar/2.jpg",
            polygonId: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
        {
            id: 3,
            name: "Cindy Baker",
            imgUrl: "/static/images/avatar/3.jpg",
            polygonId: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
            createdAt: "1634175600",
            updatedAt: "1634175600",
        },
    ];
    const channelList: IChannel[] = [
        {
            id: 1,
            channelName: "Brunch this weekend?",
            members: [members[0], members[1]],
            lastMessage: "I'll be in your neighborhood doing errands this…",
            totalUnread: 1,
            lastMessageAt: "1612363360",
        },
        {
            id: 2,
            channelName: "Summer BBQ",
            members: [members[0], members[2]],
            lastMessage: "Wish I could come, but I'm out of town this…",
            totalUnread: 2,
            lastMessageAt: "1612363360",
        },
        {
            id: 3,
            channelName: "Oui Oui",
            members: [members[1], members[2]],
            lastMessage: "Do you have Paris recommendations? Have you ever…",
            totalUnread: 0,
            lastMessageAt: "1612363360",
        },
    ];

    const handleMessageClick = (chatId: number) => {
        router.push(`/channel/${chatId}`);
    };
    return (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {channelList.map((chatList, key) => (
                <>
                    <ListItem
                        alignItems="flex-start"
                        key={key}
                        onClick={() => handleMessageClick(chatList.id)}
                    >
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={chatList.channelName}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {chatList.members
                                            .map((participant) => participant.name)
                                            .join(", ")}
                                    </Typography>
                                    {` — ${chatList.lastMessage}`}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </>
            ))}
        </List>
    );
}

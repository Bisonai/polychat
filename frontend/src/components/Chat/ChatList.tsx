import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

export interface ChatListProps {
    id: number;
    title: string;
    participant: Participant[];
    content: string;
}

export interface Participant {
    id: number;
    name: string;
    avatar: string;
    address: string;
}

export default function ChatList() {
    const router = useRouter();
    const chatLists = [
        {
            id: 1,
            title: "Brunch this weekend?",
            participant: [
                {
                    id: 1,
                    name: "Ali Connors",
                    avatar: "/static/images/avatar/1.jpg",
                    address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
                },
            ],
            content: "I'll be in your neighborhood doing errands this…",
        },
        {
            id: 2,
            title: "Summer BBQ",
            participant: [
                {
                    id: 2,
                    name: "Travis Howard",
                    avatar: "/static/images/avatar/2.jpg",
                    address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
                },
            ],
            content: "Wish I could come, but I'm out of town this…",
        },
        {
            id: 3,
            title: "Oui Oui",
            participant: [
                {
                    id: 3,
                    name: "Sandra Adams",
                    avatar: "/static/images/avatar/3.jpg",
                    address: "0x388C818CA8B9251b393131C08a736A67ccB19297",
                },
            ],
            content: "Do you have Paris recommendations? Have you ever…",
        },
    ];

    const handleChatClick = (chatId: number) => {
        router.push(`/chat/${chatId}`);
    };
    return (
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            {chatLists.map((chatList) => (
                <>
                    <ListItem
                        alignItems="flex-start"
                        key={chatList.id}
                        onClick={() => handleChatClick(chatList.id)}
                    >
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                        </ListItemAvatar>
                        <ListItemText
                            primary={chatList.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: "inline" }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {chatList.participant[0].name}
                                    </Typography>
                                    {` — ${chatList.content}`}
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

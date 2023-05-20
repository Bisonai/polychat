import MessageInput from "@components/Channel/MessageInput";
import { MessageList } from "@components/Channel/MessageList";
import { Grid } from "@mui/material";
import { getMessages } from "@src/lib/api";
import { BE_URL } from "@src/lib/constants";
import { shortenAddress } from "@src/lib/utils";
import { ReactElement, useEffect } from "react";
import { useQuery } from "react-query";

export const ChannelTemplate = ({ channelId }: { channelId: string }): ReactElement => {
    const messageQuery = useQuery(["messages", channelId], {
        queryFn: () => getMessages(channelId),
    });
    const messages = messageQuery?.data || [];
    const members = messages.map((m) => ({
        id: m.accountId,
        name: shortenAddress(m.accountAddress),
        address: m.accountAddress,
    }));

    useEffect(() => {
        if (channelId) {
            const eventSource = new EventSource(`${BE_URL}/subscribe/channel/${channelId}`, {
                withCredentials: false,
            });
            eventSource.onmessage = (event) => {
                console.log("onmessage", event);
                messageQuery.refetch();
            };
            console.log(eventSource);
            eventSource.onerror = (event) => {
                console.log("error", event);
            };
            eventSource.addEventListener("channel-2", (event) => {
                console.log("channel-2", event);
            });
        }
    }, [channelId]);

    return (
        <Grid>
            <Grid padding={4}>
                <MessageList messages={messages} />
            </Grid>
            <Grid sx={{ position: "fixed", bottom: 80, width: "100%" }}>
                <MessageInput channelId={channelId} members={members} />
            </Grid>
        </Grid>
    );
};

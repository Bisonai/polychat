import MessageInput from "@components/Channel/MessageInput";
import { MessageList } from "@components/Channel/MessageList";
import { Grid } from "@mui/material";
import { getMessages } from "@src/lib/api";
import { BE_URL } from "@src/lib/constants";
import { shortenAddress } from "@src/lib/utils";
import { ReactElement, useEffect } from "react";
import { useQuery } from "react-query";

declare global {
    // eslint-disable-next-line no-var
    var messageEvent: EventSource;
}
export const ChannelTemplate = ({ channelId }: { channelId: string }): ReactElement => {
    const messageQuery = useQuery(["messages", channelId], {
        queryFn: () => getMessages(channelId),
    });
    const messages = messageQuery?.data || [];
    const membersMap = messages
        .map((m) => ({
            id: m.accountId,
            name: m?.account?.name || "",
            address: m.accountAddress,
        }))
        .reduce((accMap, cur) => {
            accMap[cur.address] = cur;
            return accMap;
        }, {} as Record<string, { id: number; name: string; address: string }>);
    const members = Object.values(membersMap);
    useEffect(() => {
        if (channelId) {
            if (window?.messageEvent) {
                window.messageEvent.close();
            }
            const eventSource = new EventSource(`${BE_URL}/subscribe/channel/${channelId}`, {
                withCredentials: false,
            });
            window.messageEvent = eventSource;
            eventSource.onmessage = (event) => {
                console.log("onmessage", event);
                messageQuery.refetch({
                    queryKey: ["messages", channelId],
                });
            };
            console.log(eventSource);
            eventSource.onerror = (event) => {
                console.log("error", event);
            };
            eventSource.addEventListener("channel-2", (event) => {
                console.log("channel-2", event);
            });
        } else if (window?.messageEvent) {
            window.messageEvent.close();
        }
    }, [channelId]);

    return (
        <Grid>
            <Grid padding={4}>
                <MessageList messages={messages} />
            </Grid>
            <Grid
                sx={{
                    position: "fixed",
                    bottom: "56px",
                    width: "100%",
                    borderBottom: "2px solid lightgray",
                }}
            >
                <MessageInput channelId={channelId} members={members} />
            </Grid>
        </Grid>
    );
};

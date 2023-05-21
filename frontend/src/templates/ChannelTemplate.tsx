import MessageInput from "@components/Channel/MessageInput";
import { MessageList } from "@components/Channel/MessageList";
import { Divider, Grid } from "@mui/material";
import { getChannels, getMessages } from "@src/lib/api";
import { BE_URL } from "@src/lib/constants";
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
    const channelQuery = useQuery(["channels"], {
        queryFn: getChannels,
    });
    const allChannels = channelQuery?.data || [];
    const currentChannel = allChannels.find((channel) => channel.id.toString() == channelId);
    const messages = messageQuery?.data || [];
    const members = currentChannel?.members || [];
    useEffect(() => {
        if (channelId) {
            if (window?.messageEvent) {
                window.messageEvent.close();
            }
            const eventSource = new EventSource(`${BE_URL}/subscribe/channel/${channelId}`, {
                withCredentials: false,
            });
            window.messageEvent = eventSource;
            eventSource.onmessage = async (event) => {
                console.log("onmessage", event.data);
                const data = JSON.parse(event.data);
                await messageQuery.refetch({
                    queryKey: ["messages", channelId],
                });
                console.log("data", data, data?.channelId, channelId);
                if (data?.channelId == channelId) {
                    // Scroll to the bottom
                    window?.scrollTo({
                        top: document.getElementById("message-list")?.scrollHeight + 180,
                        behavior: "smooth",
                    });
                }
            };
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

    useEffect(() => {
        setTimeout(() => {
            window?.scrollTo({
                top: document.getElementById("message-list")?.scrollHeight + 180,
            });
        }, 500);
    }, []);

    return (
        <Grid>
            <MessageList
                messages={messages}
                isFetching={!messageQuery.isFetchedAfterMount && messageQuery.isFetching}
            />
            <Divider
                sx={{
                    marginTop: "64px",
                }}
            />
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

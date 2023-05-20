import MessageInput from "@components/Channel/MessageInput";
import { MessageList } from "@components/Channel/MessageList";
import { Grid } from "@mui/material";
import { getMessages } from "@src/lib/api";
import { shortenAddress } from "@src/lib/utils";
import { ReactElement } from "react";
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

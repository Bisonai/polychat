import MessageInput from "@components/Channel/MessageInput";
import { MessageList } from "@components/Channel/MessageList";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const ChannelTemplate = ({ channelId }: { channelId: string }): ReactElement => {
    return (
        <Grid>
            <Grid padding={4}>
                <MessageList messages={[]} />
            </Grid>
            <Grid sx={{ position: "fixed", bottom: 80, width: "100%" }}>
                <MessageInput channelId={channelId} />
            </Grid>
        </Grid>
    );
};

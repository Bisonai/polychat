import { MessageList } from "@components/Channel/MessageList";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const MessageListTemplate = (): ReactElement => {
    return (
        <Grid padding={4}>
            <MessageList messages={[]} />
        </Grid>
    );
};

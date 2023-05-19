import { MessageList } from "@components/Message/MessageList";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const MessageListTemplate = (): ReactElement => {
    return (
        <Grid padding={4}>
            <MessageList />
        </Grid>
    );
};

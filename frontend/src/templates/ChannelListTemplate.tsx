import MessageList from "@components/Message/Channel";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const ChannelTemplate = (): ReactElement => {
    return (
        <Grid>
            <MessageList />
        </Grid>
    );
};

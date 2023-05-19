import MessageList from "@components/Channel/Channel";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const ChannelTemplate = (): ReactElement => {
    return (
        <Grid>
            <MessageList />
        </Grid>
    );
};

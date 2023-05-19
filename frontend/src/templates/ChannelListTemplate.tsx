import ChannelList from "@components/Channel/ChannelList";
import { Grid } from "@mui/material";
import { ReactElement } from "react";

export const ChannelListTemplate = (): ReactElement => {
    return (
        <Grid>
            <ChannelList />
        </Grid>
    );
};

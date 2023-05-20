import ChannelList from "@components/Channel/ChannelList";
import { Box, Grid, IconButton, SpeedDialAction, SpeedDialIcon, styled } from "@mui/material";
import { getChannels } from "@src/lib/api";
import { ReactElement } from "react";
import { useQuery } from "wagmi";
import SpeedDial, { SpeedDialProps } from "@mui/material/SpeedDial";

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
}));

export const ChannelListTemplate = (): ReactElement => {
    const channelQuery = useQuery(["channels"], {
        queryFn: getChannels,
    });

    return (
        <Box position={"relative"} width={"100%"} height={"calc(100vh - 128px)"}>
            <ChannelList channelQuery={channelQuery as any} />
            <Grid position={"absolute"} right={"0px"} bottom={"10px"}>
                <IconButton>
                    <StyledSpeedDial
                        ariaLabel="Add Channel"
                        icon={<SpeedDialIcon />}
                    ></StyledSpeedDial>
                </IconButton>
            </Grid>
        </Box>
    );
};

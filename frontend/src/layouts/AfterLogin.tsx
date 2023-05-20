import TopNavigation from "@components/TopNavigation";
import BottomNavigation from "@components/BottomNavigation";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { BE_URL } from "@src/lib/constants";

export const AfterLogin = ({ children }) => {
    return (
        <Grid>
            <Grid>
                <TopNavigation />
            </Grid>
            {children}
            <Grid sx={{ position: "fixed", bottom: 0, width: "100%" }}>
                <BottomNavigation />
            </Grid>
        </Grid>
    );
};

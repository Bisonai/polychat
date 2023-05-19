import TopNavigation from "@components/TopNavigation";
import BottomNavigation from "@components/BottomNavigation";
import { Grid } from "@mui/material";

export const AfterLogin = ({ children }) => {
    return (
        <Grid>
            <TopNavigation />
            {children}
            <Grid sx={{ position: "fixed", bottom: 0, width: "100%" }}>
                <BottomNavigation />
            </Grid>
        </Grid>
    );
};

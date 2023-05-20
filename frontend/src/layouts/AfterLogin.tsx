import TopNavigation from "@components/TopNavigation";
import BottomNavigation from "@components/BottomNavigation";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { BE_URL } from "@src/lib/constants";
import { useQuery } from "react-query";
import { getAccount } from "@src/lib/api";
import { useAccount } from "wagmi";

export const AfterLogin = ({ children }) => {
    const { isConnected, address } = useAccount();
    const accountQuery = useQuery(["account"], {
        queryFn: () => getAccount(address),
    });

    useEffect(() => {
        if (isConnected) {
            accountQuery.refetch();
        }
    }, [isConnected]);

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

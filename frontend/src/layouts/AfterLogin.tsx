import TopNavigation from "@components/TopNavigation";
import BottomNavigation from "@components/BottomNavigation";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { BE_URL } from "@src/lib/constants";
import { useQuery } from "react-query";
import { createAccount, getAccount } from "@src/lib/api";
import { useAccount } from "wagmi";
import { getRandomProfileImage } from "@src/lib/utils";

export const AfterLogin = ({ children }) => {
    const { isConnected, address } = useAccount();
    const accountQuery = useQuery(["account"], {
        queryFn: () => getAccount(address.toLowerCase()),
    });

    useEffect(() => {
        if (address && !accountQuery?.data?.address) {
            createAccount({
                id: undefined,
                address: address.toLowerCase(),
                name: "",
                img: getRandomProfileImage(address),
            }).then((res) => {
                accountQuery.refetch();
            });
        } else if (isConnected) {
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

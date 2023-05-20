import { Badge, Grid, Typography } from "@mui/material";
import { ReactElement } from "react";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAccount } from "wagmi";
import { EvmAddress, EvmTransaction } from "moralis/common-evm-utils";
import moment from "moment";
import { shortenAddress } from "@src/lib/utils";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export const HistoryCard = ({ transaction }: { transaction: EvmTransaction }): ReactElement => {
    const { address } = useAccount();
    const isFrom = transaction.from.equals(EvmAddress.create(address));
    const title = "Transaction";

    return (
        <Grid
            display={"flex"}
            flexDirection={"column"}
            gap={"8px"}
            style={{ cursor: "pointer" }}
            onClick={() => {
                window.open(`https://mumbai.polygonscan.com/tx/${transaction.hash}`);
            }}
        >
            <Grid>
                <Badge
                    color="primary"
                    style={{
                        color: `${transaction.receiptStatus ? "#4856FC" : "#FC4857"}`,
                        border: `1px solid ${transaction.receiptStatus ? "#AFB5FE" : "#FEAFB5"}`,
                        borderRadius: "20px",
                        fontSize: "11px",
                        padding: "4px 8px",
                    }}
                >
                    {transaction.receiptStatus === 1 ? "Success" : "Failed"}
                </Badge>
            </Grid>
            <Grid display={"flex"} justifyContent={"space-between"}>
                <Grid display={"flex"} flexDirection={"column"} gap={"6px"}>
                    <Grid display={"flex"} gap={"8px"} alignItems={"center"}>
                        <Grid>{isFrom ? <LogoutIcon /> : <LoginIcon />}</Grid>
                        <Grid>
                            <Typography>{title}</Typography>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Typography color={"#848590"} fontSize={"12px"}>
                            {moment(transaction.blockTimestamp).format("YYYY.MM.DD HH:mm:ss")}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid display={"flex"} flexDirection={"column"} gap={"8px"}>
                    <Grid display={"flex"} justifyContent={"flex-end"}>
                        <Typography color={"#222225"} textAlign={"right"}>
                            {transaction.value.ether || 0} MATIC
                        </Typography>
                        <KeyboardArrowRightIcon />
                    </Grid>
                    <Grid maxWidth={"150px"} overflow={"hidden"}>
                        <Typography color={"#848590"} fontSize="12px">
                            {shortenAddress(transaction.hash)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

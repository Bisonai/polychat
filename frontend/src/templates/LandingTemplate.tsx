import { Button, Grid, MobileStepper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { connecters } from "@src/lib/utils";

export const LandingTemplate = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const { connect, error, isLoading, pendingConnector } = useConnect();
    const { address } = useAccount();

    const handlePrev = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    };
    const handleConnectWallet = () => {
        setActiveStep(1);
    };
    const handleSelectWallet = (walletName: string) => {
        const connector = connecters.Metamask;
        connect({
            chainId: 80001,
            connector,
        });
    };

    return (
        // Center
        <Grid
            alignItems={"center"}
            display={"flex"}
            flexDirection={"column"}
            sx={{ height: "calc(100vh - 64px)" }}
            justifyContent={"space-between"}
            width={"100%"}
            p={2}
        >
            <Grid
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
            >
                {activeStep === 0 && (
                    <>
                        <Typography variant="h3" fontWeight={700}>
                            CINDER
                        </Typography>
                        <Typography variant="h5">Decentralized Social Media</Typography>
                    </>
                )}
                {activeStep === 1 && (
                    <Grid
                        display={"flex"}
                        flexDirection={"column"}
                        gap={"12px"}
                        width={"100%"}
                        maxWidth={"500px"}
                    >
                        <Button
                            variant="outlined"
                            size="large"
                            color="primary"
                            sx={{ height: "56px", borderRadius: "8px" }}
                            onClick={() => handleSelectWallet("Metamask")}
                            fullWidth
                        >
                            Metamask
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            color="primary"
                            sx={{ height: "56px", borderRadius: "8px" }}
                            onClick={() => handleSelectWallet("Coinbase")}
                            fullWidth
                        >
                            Coinbase
                        </Button>
                    </Grid>
                )}
            </Grid>
            <Grid
                sx={{ width: "100%" }}
                display={"flex"}
                flexDirection={"column"}
                alignContent={"center"}
                justifyContent={"center"}
                p={2}
                gap={"40px"}
            >
                <MobileStepper
                    variant="dots"
                    steps={2}
                    position="static"
                    activeStep={activeStep}
                    sx={{ flexGrow: 1, justifyContent: "center" }}
                    backButton={""}
                    nextButton={""}
                />
                {activeStep === 0 && (
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="primary"
                        sx={{ height: "56px", borderRadius: "8px" }}
                        onClick={handleConnectWallet}
                    >
                        Connect Wallet
                    </Button>
                )}
                {activeStep > 0 && (
                    <Button
                        fullWidth
                        size="large"
                        color="info"
                        sx={{ height: "56px", borderRadius: "8px" }}
                        onClick={handlePrev}
                        style={{ textDecoration: "underline" }}
                    >
                        Go Back
                    </Button>
                )}
            </Grid>
        </Grid>
    );
};

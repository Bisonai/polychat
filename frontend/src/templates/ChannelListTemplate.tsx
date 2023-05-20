import ChannelList from "@components/Channel/ChannelList";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Modal,
    Skeleton,
    SpeedDialIcon,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import { createChannel, getAccounts, getChannels } from "@src/lib/api";
import { ReactElement, useRef, useState } from "react";
import { useAccount, useQuery } from "wagmi";
import SpeedDial from "@mui/material/SpeedDial";
import { SelectForm } from "@components/Form/SelecteForm";
import SendIcon from "@mui/icons-material/Send";
import { IChannel, IChannelCreateDTO } from "@src/types";
import { toast } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
};

export const ChannelListTemplate = (): ReactElement => {
    const [openCreateChannelModal, setOpenCreateChannelModal] = useState<boolean>(false);
    const textInputRef = useRef<HTMLInputElement>(null);
    const [memberIDs, setMemberIDs] = useState<number[]>([]);

    const { address } = useAccount();

    const channelQuery = useQuery(["channels"], {
        queryFn: getChannels,
    });

    const accountsQuery = useQuery(["accounts"], {
        queryFn: getAccounts,
    });
    const accounts = accountsQuery.data || [];

    const handleCreateChannelClicked = () => {
        console.log("handleCreateChannelClicked");
        setOpenCreateChannelModal(!openCreateChannelModal);
    };

    const handleCreateButtonClicked = async () => {
        const channelName = textInputRef.current.value ?? " ";

        console.log("create channel, memberIds: ", memberIDs);
        // Append my address to the member list at last
        const myAccountId = accounts.find(
            (account) => account?.address?.toLowerCase() == address?.toLowerCase(),
        )?.id;
        if (!myAccountId) {
            return accountsQuery.refetch();
        }
        const members: number[] = [...memberIDs, myAccountId];
        const newChannelInfo: IChannelCreateDTO = {
            channelName,
            members,
        };
        await createChannel(newChannelInfo)
            .then((res) => {
                toast.success("Channel created!");
                setOpenCreateChannelModal(false);
                channelQuery.refetch();
            })
            .catch((err) => {
                toast.error("Failed to create channel");
                console.log(err);
            });
    };
    const handleSelectMember = (memberId: number[]) => {
        setMemberIDs(memberId);
    };

    const renderCreateChannelModal = () => (
        <Modal open={openCreateChannelModal} onClose={handleCreateChannelClicked}>
            <Container sx={modalStyle}>
                <Typography sx={{ mb: 3 }} variant="h6">
                    Create Open Chat
                </Typography>
                <TextField
                    inputRef={textInputRef}
                    sx={{ mb: 2 }}
                    fullWidth
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                />
                {accountsQuery.isFetching ? (
                    <Skeleton />
                ) : (
                    <SelectForm
                        accounts={accounts.filter(
                            (account) => account?.address?.toLowerCase() != address?.toLowerCase(),
                        )}
                        handleSelectMember={handleSelectMember}
                    ></SelectForm>
                )}
                <Button
                    sx={{
                        height: 56,
                        borderRadius: "8px",
                        my: 2,
                    }}
                    endIcon={<SendIcon />}
                    variant="contained"
                    onClick={handleCreateButtonClicked}
                    fullWidth
                >
                    Create
                </Button>
            </Container>
        </Modal>
    );

    return (
        <div>
            <Box position={"relative"} width={"100%"} height={"calc(100vh - 128px)"}>
                <Box width={"100%"} height={"100px"} boxShadow={1} marginBottom={2}>
                    <Swiper spaceBetween={50} slidesPerView={1}>
                        {[
                            {
                                fileName: "ad-polygon.webp",
                                link: "https://www.polygon.technology/",
                            },
                            { fileName: "ad-nearprotocol.jpeg", link: "https://near.org/" },
                            { fileName: "ad-avalanche.png", link: "https://www.avalabs.org/" },
                            { fileName: "ad-bnb.png", link: "https://www.binance.com/en" },
                            { fileName: "ad-bifrost.png", link: "https://bifrost.finance/" },
                        ].map(({ fileName, link }, index) => (
                            <SwiperSlide key={index}>
                                <Button href={link} target="_blank" fullWidth>
                                    <img
                                        width={"100%"}
                                        height={"100px"}
                                        src={"/images/" + fileName}
                                        style={{
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                    />
                                </Button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
                {channelQuery?.data?.length > 0 ? (
                    <ChannelList channelQuery={channelQuery as any} />
                ) : (
                    <Box width={"100%"} height={"100%"} marginTop={12} textAlign={"center"}>
                        <img
                            src="/images/warning.svg"
                            alt="empty"
                            style={{ width: "100%", maxWidth: "200px" }}
                            height={"auto"}
                        />
                        <Typography variant={"h6"} align="center" color={"#d4d4d8"}>
                            No Channel found
                        </Typography>
                    </Box>
                )}

                <Grid position={"fixed"} right={"0px"} bottom={"80px"}>
                    <IconButton onClick={handleCreateChannelClicked}>
                        <StyledSpeedDial
                            ariaLabel="Add Channel"
                            icon={<SpeedDialIcon />}
                        ></StyledSpeedDial>
                    </IconButton>
                </Grid>
            </Box>
            {renderCreateChannelModal()}
        </div>
    );
};

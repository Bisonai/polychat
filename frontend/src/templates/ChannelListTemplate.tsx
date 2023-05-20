import ChannelList from "@components/Channel/ChannelList";
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    Modal,
    SpeedDialIcon,
    TextField,
    Typography,
    styled,
} from "@mui/material";
import { createChannel, getChannels } from "@src/lib/api";
import { ReactElement, useRef, useState } from "react";
import { useQuery } from "wagmi";
import SpeedDial from "@mui/material/SpeedDial";
import { SelectForm } from "@components/Form/SelecteForm";
import SendIcon from "@mui/icons-material/Send";
import { IChannel, IChannelCreateDTO } from "@src/types";

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
    const [members, setMembers] = useState<number[]>([]);

    const channelQuery = useQuery(["channels"], {
        queryFn: getChannels,
    });

    const updateMembers = (memberId: number) => {
        const newMembers = members.push(memberId);
    };

    const handleCreateChannelClicked = () => {
        console.log("handleCreateChannelClicked");
        setOpenCreateChannelModal(!openCreateChannelModal);
    };

    const handleCreateButtonClicked = async () => {
        const name = textInputRef.current.value ?? " ";
        const newChannelInfo: IChannelCreateDTO = {
            channelName: name,
            members: members,
        };

        await createChannel(newChannelInfo)
            .then((res) => {
                console.log("success creating a channel");
                setOpenCreateChannelModal(false);
            })
            .catch((err) => {
                console.log(err);
            });
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
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                />
                <SelectForm channelQuery={channelQuery as any}></SelectForm>
                <Button
                    sx={{
                        width: 140,
                        height: 48,
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        background: "#4856FC",
                        my: 2,
                    }}
                    endIcon={<SendIcon />}
                    variant="contained"
                    onClick={handleCreateButtonClicked}
                >
                    Create
                </Button>
            </Container>
        </Modal>
    );

    return (
        <div>
            <Box position={"relative"} width={"100%"} height={"calc(100vh - 128px)"}>
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

                <Grid position={"absolute"} right={"0px"} bottom={"10px"}>
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

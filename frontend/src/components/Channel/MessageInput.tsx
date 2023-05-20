import * as React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import IconSend from "@mui/icons-material/Send";
import IconAdd from "@mui/icons-material/Add";
import { InputBase } from "@mui/material";

export default function MessageInput({ channelId }: { channelId: string }) {
    const handleSendMessage = (event: any) => {
        // Check If it is shift + enter
        if (event.shiftKey && event.key === "Enter") {
            return;
        }
        // TODO:Send Message
        console.log(event.target.value);
    };
    return (
        <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}
        >
            <IconButton sx={{ p: "10px" }} aria-label="Send Assets">
                <IconAdd />
            </IconButton>
            <InputBase
                id="outlined-multiline-flexible"
                multiline
                maxRows={2}
                fullWidth
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSendMessage(e);
                    }
                }}
            />
            <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
                <IconSend />
            </IconButton>
        </Paper>
    );
}

import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Skeleton,
    Theme,
    useTheme,
} from "@mui/material";
import { isEmpty } from "@src/lib/utils";
import { IAccount, IChannel } from "@src/types";
import React from "react";
import { ReactElement } from "react";
import { UseQueryResult } from "react-query";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

export function SelectForm({
    accounts,
    handleSelectMember,
}: {
    accounts: IAccount[];
    handleSelectMember: (memberId: number) => any;
}): ReactElement {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>();

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(typeof value === "string" ? value.split(",") : value);

        console.log("handleChange: value: ", value);

        const selectedAccount = accounts.find((account) => account.name == value);
        handleSelectMember(selectedAccount.id);
    };

    return isEmpty(accounts) ? (
        <div></div>
    ) : (
        <div>
            <FormControl sx={{ width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Invite</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="invite" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.name}>
                            {account.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

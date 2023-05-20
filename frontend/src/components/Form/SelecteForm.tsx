import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import { isEmpty, shortenAddress } from "@src/lib/utils";
import { IAccount } from "@src/types";
import React from "react";
import { ReactElement } from "react";

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

export function SelectForm({
    accounts,
    handleSelectMember,
    ...props
}: {
    accounts: IAccount[];
    handleSelectMember: (memberId: number[]) => any;
}): ReactElement {
    const [idList, setIdList] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof idList>) => {
        const {
            target: { value },
        } = event;
        if (typeof value === "string") {
            setIdList(value.split(","));
            handleSelectMember([parseInt(value)]);
        } else {
            setIdList(value);
            handleSelectMember(value.map((id) => parseInt(id)));
        }
    };

    return isEmpty(accounts) ? (
        <div></div>
    ) : (
        <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">Invite</InputLabel>
            <Select
                {...props}
                fullWidth
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={idList}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="invite" />}
                renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                            const selectedAccount = accounts.find(
                                (account) => account.id.toString() == value,
                            );
                            return (
                                <Chip
                                    key={value}
                                    label={
                                        selectedAccount.name ||
                                        shortenAddress(selectedAccount.address)
                                    }
                                />
                            );
                        })}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                        <Typography variant="body2" fontWeight={600}>
                            {account.name}
                        </Typography>
                        &nbsp;
                        <Typography variant="caption">
                            ({shortenAddress(account.address)})
                        </Typography>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

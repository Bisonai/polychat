import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { routes } from "@src/lib/route";
import { useQuery, useQueryClient } from "react-query";
import { IChannel } from "@src/types";
import { getChannels } from "@src/lib/api";
import { ParsedUrlQuery } from "querystring";

export default function TopNavigation() {
    const { disconnect } = useDisconnect();
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const router = useRouter();
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const channelQuery = useQuery(["channels"], {
        queryFn: getChannels,
    });
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = () => {
        disconnect();
    };

    const menuId = "primary-search-account-menu";
    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleLogout}>
                <IconButton size="large" aria-label="Logout" color="inherit">
                    <LogoutIcon />
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );

    const getCurrentChannel = (channels: IChannel[], curChannelId: number): IChannel => {
        return channels.find((ch) => ch.id == curChannelId);
    };

    const parseRouterQueryForChannelId = (query: ParsedUrlQuery): number | undefined => {
        const key = "channelId";
        if (!(key in query)) return;

        return parseInt(query.channelId.toString());
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: "none", sm: "block" } }}
                    >
                        <img src="/images/nav-logo.png" alt="logo" width={100} height={39} />
                    </Typography>
                    {channelQuery.isFetching ? (
                        <div></div>
                    ) : (
                        <Typography>
                            {
                                getCurrentChannel(
                                    channelQuery.data,
                                    parseRouterQueryForChannelId(router.query),
                                )?.channelName
                            }
                        </Typography>
                    )}
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={() => router.push(routes.home)}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="show messenger"
                            color="inherit"
                            onClick={() => router.push(routes.channel)}
                        >
                            {/* <Badge badgeContent={4} color="error"> */}
                            <MailIcon />
                            {/* </Badge> */}
                        </IconButton>

                        <IconButton
                            onClick={handleLogout}
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>
    );
}

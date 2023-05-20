import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ChatIcon from "@mui/icons-material/Chat";
import HomeIcon from "@mui/icons-material/Home";
import { Route, routes } from "@src/lib/route";
import { useRouter } from "next/router";

const getRouteFromUrl = (): Route => {
    const pathName = window.location.pathname;
    const route = Object.keys(routes).find((key) => routes[key] === pathName);
    return route as Route;
};

export default function LabelBottomNavigation() {
    const [value, setValue] = React.useState<Route>(Route.home);
    const router = useRouter();

    const handleChange = (event: React.SyntheticEvent, newValue: Route) => {
        const url = routes[newValue];
        setValue(newValue);
        router.push(url);
    };

    React.useEffect(() => {
        const route = getRouteFromUrl();
        setValue(route);
    }, []);

    return (
        <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction
                label="Home"
                value={Route.home}
                icon={<HomeIcon />}
                showLabel
                defaultChecked
            />
            <BottomNavigationAction
                label="Message"
                value={Route.channel}
                icon={<ChatIcon />}
                showLabel
            />
            <BottomNavigationAction
                label="History"
                value={Route.history}
                icon={<SwapHorizIcon />}
                showLabel
            />
        </BottomNavigation>
    );
}

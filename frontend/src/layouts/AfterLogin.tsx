import TopNavigation from "@components/TopNavigation";
import BottomNavigation from "@components/BottomNavigation";

export const AfterLogin = ({ children }) => {
    return (
        <div>
            <TopNavigation />
            {children}
            <BottomNavigation />
        </div>
    );
};

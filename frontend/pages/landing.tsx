import { BeforeLogin } from "@src/layouts/BeforeLogin";
import { LandingTemplate } from "@src/templates/LandingTemplate";

const LandingPage = () => {
    return (
        <BeforeLogin>
            <LandingTemplate />
        </BeforeLogin>
    );
};

export default LandingPage;

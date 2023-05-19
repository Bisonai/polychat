import { HomeTemplate } from "@src/templates/HomeTemplate";
import { useAccount, useConnect, useEnsName } from "wagmi";

const HomePage = () => {
    // const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
    const { isConnected } = useAccount();
    console.log(useAccount());
    return <HomeTemplate />;
};

export default HomePage;

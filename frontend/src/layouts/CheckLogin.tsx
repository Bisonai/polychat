import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { AfterLogin } from "./AfterLogin";
import { BeforeLogin } from "./BeforeLogin";
import { routes } from "@src/lib/route";
//FOR TESTING
import { fetchBalance } from "@wagmi/core";
//FOR TESTING

export const CheckLogin = ({ children }) => {
    const { isConnected, connector, address } = useAccount();
    const router = useRouter();

    useEffect(() => {
        //FOR TESTING
        if (isConnected) {
            // .then or await
            fetchBalance({ address, chainId: 80001 }).then((res) => {
                console.log(res);
            });
        }
        //FOR TESTING

        if (!isConnected) {
            router.push(routes.landing);
        } else if (router.pathname.includes(routes.landing)) {
            router.push(routes.home);
        }
    }, [isConnected]);
    return (
        <>
            {isConnected ? (
                <AfterLogin>{children}</AfterLogin>
            ) : (
                <BeforeLogin>{children}</BeforeLogin>
            )}
        </>
    );
};

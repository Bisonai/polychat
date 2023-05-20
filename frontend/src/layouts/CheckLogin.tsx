import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { AfterLogin } from "./AfterLogin";
import { BeforeLogin } from "./BeforeLogin";
import { routes } from "@src/lib/route";

export const CheckLogin = ({ children }) => {
    const { isConnected, connector, address } = useAccount();
    const router = useRouter();

    useEffect(() => {
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

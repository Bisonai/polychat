import { IWalletName } from "@src/types";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { polygonMumbai } from "@wagmi/core/chains";

const chains = [polygonMumbai]
const metaMaskConnector = new MetaMaskConnector({ chains })
const coinbaseWalletConnector = new CoinbaseWalletConnector({
    chains,
    options: {
        appName: "cinder",
    },
})
// const walletConnectConnector = new WalletConnectConnector({
//     chains,
//     options: {
//         projectId: "cinder",
//     },
// })

export const connecters: Record<IWalletName, any> = {
    [IWalletName.Metamask]: metaMaskConnector,
    [IWalletName.Coinbase]: coinbaseWalletConnector,
    // [IWalletName.WalletConnect]: walletConnectConnector,
}
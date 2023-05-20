import { IWalletName } from "@src/types";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { polygonMumbai } from "@wagmi/core/chains";
import Moralis from 'moralis'

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

export const shortenAddress = (address: string, chars = 5) => {
    return `${address.substring(0, chars + 2)}...${address.substring(
        address.length - chars,
        address.length
    )}`
}
import { IWalletName } from "@src/types";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { polygonMumbai } from "@wagmi/core/chains";
import Moralis from 'moralis'
import { EvmNft } from "moralis/common-evm-utils";
import { Connector } from "wagmi";
import ERC20Abi from "@src/lib/abi/ERC20.json";
import ERC721Abi from "@src/lib/abi/ERC721.json";
import { ethers } from 'ethers'

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


export const sendNFT = async (connector: Connector, nft: EvmNft, to: string) => {
    // SEND ERC721 NFT
    const provider = await connector.getProvider({ chainId: 80001 })
    const contract = new ethers.Contract(nft.tokenAddress.toJSON(), ERC721Abi.abi, provider)
    const nftContract = contract.connect(provider.getSigner())
    return nftContract.safeTransferFrom(provider.getSigner().getAddress(), to, nft.tokenId)
}


export const sendToken = async (connector: Connector, nft: EvmNft, to: string) => {
    // SEND ERC721 NFT


}
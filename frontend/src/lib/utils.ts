import { IWalletName } from "@src/types";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { polygonMumbai } from "@wagmi/core/chains";
import Moralis from "moralis";
import { Erc20Token, EvmNft } from "moralis/common-evm-utils";
import { Connector } from "wagmi";
import { erc20ABI } from "wagmi";
import { erc721ABI } from "wagmi";
import { ethers } from "ethers";
import { TransactionReceipt } from "viem";

const chains = [polygonMumbai];
const metaMaskConnector = new MetaMaskConnector({ chains });
const coinbaseWalletConnector = new CoinbaseWalletConnector({
    chains,
    options: {
        appName: "cinder",
    },
});
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
};

export const shortenAddress = (address: string, chars = 5) => {
    return `${address.substring(0, chars + 2)}...${address.substring(
        address.length - chars,
        address.length,
    )}`;
};

export const sendNFT = async (
    connector: Connector,
    nft: EvmNft,
    to: string,
): Promise<TransactionReceipt> => {
    const provider = new ethers.providers.Web3Provider(
        await connector.getProvider({ chainId: 80001 }),
    );
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(nft.tokenAddress.toJSON(), erc721ABI, provider);
    const nftContract = contract.connect(signer);
    const request = await nftContract.transferFrom(
        provider.getSigner().getAddress(),
        to,
        nft.tokenId,
    );
    return request.wait();
};

export const sendToken = async (
    connector: Connector,
    token: Erc20Token,
    amount: number,
    to: string,
): Promise<TransactionReceipt> => {
    const provider = new ethers.providers.Web3Provider(
        await connector.getProvider({ chainId: 80001 }),
    );
    const signer = await provider.getSigner();
    let request;
    if (token.symbol === "MATIC") {
        request = await signer.sendTransaction({
            to: to,
            value: ethers.utils.parseEther(amount.toString()),
        });
    } else {
        const contract = new ethers.Contract(token.contractAddress.toString(), erc20ABI, provider);
        const tokenContract = contract.connect(signer);
        request = await tokenContract.transfer(to, amount);
    }

    return request.wait();
};

export function isEmpty(obj: Record<string, any>): boolean {
    if (obj == undefined || obj == null) {
        return true;
    }
    return Object.keys(obj).length === 0;
}

export function getTokenPriceInUSD(listOfPrice, tokenQuantity, tokenSymbol): number {
    if (isEmpty(listOfPrice)) return 0;

    try {
        const tokenInfo = listOfPrice.find((info) => info.symbol == tokenSymbol);
        return tokenInfo.quote.USD.price * tokenQuantity;
    } catch (err) {
        // console.error(err);
        return 0;
    }
}

export function getTokenPercentChangeIn24h(listOfPrice, tokenSymbol): number {
    if (isEmpty(listOfPrice)) return 0;

    try {
        const tokenInfo = listOfPrice.find((info) => info.symbol == tokenSymbol);
        return tokenInfo.quote.USD.percent_change_24h;
    } catch (err) {
        // console.error(err);
        return 0;
    }
}

export function getRandomProfileImage(address: string | null | undefined) {
    const index = address ? parseInt(`${address}`.slice(-2), 16) % 160 : 0;
    return `/profile_400/profile_${index + 1}.jpg`;
}
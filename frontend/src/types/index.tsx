export interface IChannel {
    id: number;
    channelName: string;
    members: IAccount[];
    totalUnread: number;
    lastMessage: string;
    lastMessageAt: string;
}
export interface IAccount {
    id: number;
    address: string;
    name?: string;
    img?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface IMessage {
    id: bigint;
    channelId: number;
    accountId: number;
    accountAddress?: string;
    contractAddress?: string;
    messageType: IMessageType;
    txHash?: string;
    tokenValue?: number;
    nftTokenId?: string;
    nftTokenUri?: string;
    message: string;
    createdAt?: string;
    deletedAt?: string;
}

/**
 * Transaction History of the account
 * @interface /api/history/:address
 * @returns {IHistory[]}
 */
export interface IHistory {
    id: number;
    messageId: number;
    txType: string;
    txHash: string;
    txReceipt: string;
    txResult: string;
    status: string;
    imgUrl: string;
    createdAt: string;
}

export enum IMessageType {
    text = "text",
    nft = "nft",
    token = "token",
}

export interface IMember {
    channelId: number;
    accountId: number;
}

/**
 * @interface /api/unreaded
 */
export interface IUnreadedMessage {
    count: number;
}

export enum IWalletName {
    Metamask = "Metamask",
    Coinbase = "Coinbase",
    // WalletConnect = "WalletConnect",
}

export interface IBalance {
    chainName: string;
    tickerName: string;
    symbol: string;
    quantity: number;
    valueInUSD: string;
    formatted: string;
    percentChange24h?: number;
}

export type IAccountCreateDto = Omit<IAccount, "id" | "createdAt" | "updatedAt">;

export interface IChannelCreateDTO {
    channelName: string;
    members: [number];
}

export type IMessageCreateDto = Omit<IMessage, "id" | "createdAt" | "deletedAt">;

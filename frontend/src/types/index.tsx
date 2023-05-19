/**
 * @interface /api/channels
 * @returns {IChannel[]}
 */
export interface IChannel {
    id: number;
    channelName: string;
    members: IAccount[];
    totalUnread: number;
    lastMessage: string;
    lastMessageAt: string;
}

/**
 * @interface /api/account/:address
 * @returns {IAccount}
 */
export interface IAccount {
    id: number;
    address: string;
    name: string;
    imgUrl: string;
    /**
     * 미정
     */
    polygonId: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * @interface /api/messages/:channelId
 * @returns {IMessage[]}
 */
export interface IMessage {
    id: number;
    channelId: number;
    sequence: number;
    accountAddress: string;
    contractAddress: string;
    messageType: IMessageType;
    txHash: string;
    tokenValue: number;
    nftTokenId: string;
    nftTokenUri: string;
    message: string;
    createdAt: string;
    deletedAt: string;
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

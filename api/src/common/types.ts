import { IAccount } from "src/api/dto/accountDto";

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

/**
 * @interface /api/unreaded
 */
export interface IUnreadedMessage {
  count: number;
}

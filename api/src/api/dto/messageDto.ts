import { OmitType } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime";
import { IAccount } from "./accountDto";

export interface IMessage {
  id: bigint;
  channelId: number;
  accountId: number;
  accountAddress?: string;
  contractAddress?: string;
  account?: IAccount;
  messageType: IMessageType;
  txHash?: string;
  tokenValue?: Decimal;
  nftTokenId?: string;
  nftTokenUri?: string;
  message: string;
  createdAt?: Date;
  deletedAt?: Date;
}

export interface IMessageCreateDto
  extends Omit<IMessage, "id" | "createdAt" | "deletedAt"> {}

export enum IMessageType {
  text = "text",
  nft = "nft",
  token = "token",
}

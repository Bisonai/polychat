import { OmitType } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime";

export interface IMessage {
  id: bigint;
  channelId: number;
  accountId: number;
  accountAddress?: string;
  contractAddress?: string;
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

import { IAccount } from "./accountDto";

export interface IMember {
  channelId: number;
  accountId: number;
}

export interface IMemberCreateDto {
  id: number;
  members: [number];
}

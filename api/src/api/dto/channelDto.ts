import { IAccount } from "./accountDto";

export interface IChannel {
  id: number;
  channelName: string;
  members: IAccount[];
  totalUnread: number;
  lastMessage: string;
  lastMessageAt: Date;
}

// export interface IChannelCreateDTO
//   extends Partial<Pick<IChannel, "channelName">> {
//   members: [number];
// }
export interface IChannelCreateDTO {
  channelName: string;
  members: [number];
}

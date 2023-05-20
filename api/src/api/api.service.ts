import { Injectable } from "@nestjs/common";
import { Prisma, accounts, channels, messages } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/prisma.service";
import { IAccount, IAccountCreateDto } from "./dto/accountDto";
import { IChannel, IChannelCreateDTO } from "./dto/channelDto";
import { IMember, IMemberCreateDto } from "./dto/memberDto";
import { isChain } from "mathjs";
import { IMessage, IMessageCreateDto, IMessageType } from "./dto/messageDto";

@Injectable()
export class ApiService {
  constructor(private prisma: PrismaService) { }

  async createAccount(_accountCreateDto: IAccountCreateDto): Promise<IAccount> {
    const { address, name } = _accountCreateDto;
    const res = await this.prisma.accounts.upsert({
      where: { address },
      create: { address, name },
      update: { name, updated_at: new Date() }
    });

    const account: IAccount = {
      id: res.id,
      address: res.address,
      name: res.name,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
    };
    return account;
  }

  async createChannel(_channelCreateDto: IChannelCreateDTO): Promise<IChannel> {
    const { channelName, members } = _channelCreateDto;
    const { id } = await this.prisma.channels.create({
      data: { channel_name: channelName },
    });
    await this.createMember({ id, members });
    const channelData = await this.prisma.channels.findUnique({
      where: { id },
      include: { members: true },
    });
    let accountMember: IAccount[] = [];
    await Promise.all(
      await channelData.members.map(async (member) => {
        const account = await this.prisma.accounts.findFirst({
          where: { id: member.account_id },
        });
        accountMember.push({
          id: account.id,
          address: account.address,
          name: account.name,
          img: account.img,
          createdAt: account.created_at,
          updatedAt: account.updated_at,
        });
      })
    );
    const channel: IChannel = {
      id,
      channelName: channelData.channel_name,
      members: accountMember,
      totalUnread: channelData.total_unread,
      lastMessage: channelData.last_message,
      lastMessageAt: channelData.last_message_at,
    };
    return channel;
  }

  async createMember(_memberCreateDto: IMemberCreateDto): Promise<any> {
    await Promise.all(
      await _memberCreateDto.members.map(async (member) => {
        await this.prisma.members.create({
          data: { channel_id: _memberCreateDto.id, account_id: member },
        });
      })
    );
  }

  async createMessage(_messageCreateDto: IMessageCreateDto): Promise<IMessage> {
    const message: messages = await this.prisma.messages.create({
      data: {
        channel_id: _messageCreateDto.channelId,
        account_id: _messageCreateDto.accountId,
        account_address: _messageCreateDto.accountAddress,
        contract_address: _messageCreateDto.contractAddress,
        message_type: _messageCreateDto.messageType,
        tx_hash: _messageCreateDto.txHash,
        token_value: _messageCreateDto.tokenValue,
        nft_token_id: _messageCreateDto.nftTokenId,
        nft_token_uri: _messageCreateDto.nftTokenUri,
        message: _messageCreateDto.message,
      },
    });
    return {
      id: message.id,
      channelId: message.channel_id,
      accountId: message.account_id,
      accountAddress: message.account_address,
      contractAddress: message.contract_address,
      messageType: message.message_type as IMessageType,
      txHash: message.tx_hash,
      tokenValue: message.token_value,
      nftTokenId: message.nft_token_id,
      nftTokenUri: message.nft_token_uri,
      message: message.message,
      createdAt: message.created_at,
      deletedAt: message.deleted_at,
    };
  }

  //******************************* select  ******************************/
  async getAllList(): Promise<IChannel[]> {
    const channels = await this.prisma.channels.findMany({
      include: { members: true },
    });
    let data: IChannel[] = [];

    await Promise.all(
      await channels.map(async (channel) => {
        const _members = channel.members;
        let accountMember: IAccount[] = [];

        await Promise.all(
          await channel.members.map(async (member) => {
            const account = await this.prisma.accounts.findFirst({
              where: { id: member.account_id },
            });
            accountMember.push({
              id: account.id,
              address: account.address,
              name: account.name,
              img: account.img,
              createdAt: account.created_at,
              updatedAt: account.updated_at,
            });
          })
        );

        const cl: IChannel = {
          id: channel.id,
          channelName: channel.channel_name,
          members: accountMember,
          totalUnread: channel.total_unread,
          lastMessage: channel.last_message,
          lastMessageAt: channel.last_message_at,
        };
        data.push(cl);
      })
    );
    return [...data].sort((a, b) => b.id - a.id);
  }

  async getAllChannelMessage(id: number): Promise<IMessage[]> {
    console.log("id:", id);
    const messages = await this.prisma.messages.findMany({
      where: { channel_id: +id },
      include: {
        accounts: true,
      },
      orderBy: { id: "asc" },
    });
    let data: IMessage[] = [];

    await Promise.all(
      await messages.map(async (message) => {
        const account: IAccount = {
          id: message.accounts.id,
          address: message.accounts.address,
          name: message.accounts.name,
          img: message.accounts.img,
          createdAt: message.accounts.created_at,
          updatedAt: message.accounts.updated_at
        }
        const _message: IMessage = {
          id: message.id,
          channelId: message.channel_id,
          accountId: message.account_id,
          accountAddress: message.account_address,
          contractAddress: message.contract_address,
          messageType: message.message_type as IMessageType,
          txHash: message.tx_hash,
          tokenValue: message.token_value,
          nftTokenId: message.nft_token_id,
          nftTokenUri: message.nft_token_id,
          message: message.message,
          createdAt: message.created_at,
          deletedAt: message.deleted_at,
          account
        };
        data.push(_message);
      })
    );
    return data;
  }

  async findOneAccount(address:string): Promise<IAccount>{
    const res = await this.prisma.accounts.findFirst({ where: { address } })
    if (!res) {
      // Handle the case where the account is not found
      throw new Error('Account not found');
    }
    const account: IAccount = {
      id: res.id,
      address: res.address,
      name: res.name,
      createdAt: res.created_at,
      updatedAt: res.updated_at,
    };
    return account;
    
  }
}

import { Injectable } from "@nestjs/common";
import { Prisma, accounts, channels, messages } from "@prisma/client";
import { channel } from "diagnostics_channel";
import { PrismaService } from "src/prisma.service";
import { IAccount, IAccountCreateDto } from "./dto/accountDto";
import { IChannel, IChannelCreateDTO } from "./dto/channelDto";
import { IMember, IMemberCreateDto } from "./dto/memberDto";
import { isChain } from "mathjs";
import { IMessage, IMessageCreateDto } from "./dto/messageDto";

@Injectable()
export class ApiService {
  constructor(private prisma: PrismaService) {}

  async createAccount(_accountCreateDto: IAccountCreateDto): Promise<IAccount> {
    const { address, name } = _accountCreateDto;
    const res = await this.prisma.accounts.create({ data: { address, name } });
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
    console.log("channel accounts:", channelData.members);
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
    console.log(accountMember);
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
      messageType: message.message_type,
      txHash: message.tx_hash,
      tokenValue: message.token_value,
      nftTokenId: message.nft_token_id,
      nftTokenUri: message.nft_token_uri,
      message: message.message,
      createdAt: message.created_at,
      deletedAt: message.deleted_at,
    };
  }
}
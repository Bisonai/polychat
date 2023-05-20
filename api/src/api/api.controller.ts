import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOperation } from "@nestjs/swagger";
import { ApiService } from "./api.service";
import { IAccount, IAccountCreateDto } from "./dto/accountDto";
import { IChannel, IChannelCreateDTO } from "./dto/channelDto";
import { IMessage, IMessageCreateDto } from "./dto/messageDto";

@Controller("/api")
export class ApiController {
  //* Insert Channel *//
  constructor(private readonly apiService: ApiService) {}

  @Post("/account")
  @ApiOperation({ operationId: "createNewAccount" })
  @ApiBody({ description: "address" })
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async createAccount(
    @Body() _accountCreateDto: IAccountCreateDto
  ): Promise<IAccount> {
    return await this.apiService.createAccount(_accountCreateDto);
  }

  @Post("/channel")
  @ApiOperation({ operationId: "createNewChannel" })
  @ApiBody({ description: "create new channel" })
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async createChannel(
    @Body() _channelDto: IChannelCreateDTO
  ): Promise<IChannel> {
    //todo existing channel duplication check
    //toda member existing check
    return await this.apiService.createChannel(_channelDto);
  }

  @Post("/message")
  @ApiOperation({ operationId: "createNewMessage" })
  @ApiBody({ description: "create new message" })
  @ApiBadRequestResponse()
  @HttpCode(HttpStatus.OK)
  async createMessage(
    @Body() _messageCreateDto: IMessageCreateDto
  ): Promise<IMessage> {
    return await this.apiService.createMessage(_messageCreateDto);
  }
}
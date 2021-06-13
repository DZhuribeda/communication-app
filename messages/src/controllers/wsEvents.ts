import { IsDefined, IsInt, IsPositive } from "class-validator";
import {
  JsonController,
  Authorized,
  OnUndefined,
  Post,
  Body,
} from "routing-controllers";
import { Service } from "typedi";
import { Logger, LoggerInterface } from "../decorators/logger";
import { UserId } from "../decorators/userId";
import { ChannelsService } from "../services/channels";
import { MessagesService } from "../services/messages";
import { ChannelAction, CHANNEL_NAMESPACE } from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

class MessageDto {
  @IsInt()
  @IsPositive()
  channelId!: number;

  @IsDefined()
  text!: string;
}

@JsonController("/_/api/v1/wsEvents/")
@Service()
export class ChannelsController {
  constructor(
    @Logger() private logger: LoggerInterface,
    private channelsService: ChannelsService,
    private messagesService: MessagesService
  ) {}

  @Authorized()
  @OnUndefined(200)
  @Post("connect/")
  connect(@UserId() userId: string) {
    this.logger.debug("connected to messages", { userId });
    this.channelsService.subcribesUserToChannels(userId);
  }

  @Authorized(createRole(CHANNEL_NAMESPACE, ChannelAction.WRITE))
  @OnUndefined(200)
  @Post("event/message/")
  newMessage(@UserId() userId: string, @Body() messageDto: MessageDto) {
    this.logger.debug("new message from user", { userId });
    this.messagesService.create(userId, messageDto.channelId, messageDto.text);
  }
}

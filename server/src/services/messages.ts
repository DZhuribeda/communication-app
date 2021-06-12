import { Service } from "typedi";
import { Logger, LoggerInterface } from "../decorators/logger";
import { getChannelRoom } from "../utils/channels";
import { MessagesRepository } from "./repositories/messages";
import { WebsocketsService } from "./ws";

@Service()
export class MessagesService {
  constructor(
    @Logger() private logger: LoggerInterface,
    private messagesRepository: MessagesRepository,
    private websocketsService: WebsocketsService
  ) {}

  async create(creatorId: string, channelId: number, text: string) {
    const message = await this.messagesRepository.create(
      creatorId,
      channelId,
      text
    );
    const channelRoom = getChannelRoom(channelId);
    this.logger.info("Emitted message:created event to room", {
      userId: creatorId,
      channelRoom,
    });
    const payload = {
      messageId: message.id,
      userId: creatorId,
      text: text,
      channelId: channelId,
    };
    this.websocketsService.emitMessage(channelRoom, "message:created", payload);
    return message.id;
  }
}

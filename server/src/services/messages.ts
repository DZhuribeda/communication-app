import { Service } from "typedi";
import { messageCreatedEvent } from "../events/messages";
import { MessagesRepository } from "./repositories/messages";

@Service()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async create(creatorId: string, channelId: number, text: string) {
    const messageId = await this.messagesRepository.create(
      creatorId,
      channelId,
      text
    );
    messageCreatedEvent.emit({
      messageId,
      userId: creatorId,
      channelId,
      text,
    });
    return messageId;
  }
}

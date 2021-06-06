import { Socket } from "socket.io";
import {
  ConnectedSocket,
  OnConnect,
  OnMessage,
  SocketController,
  MessageBody,
  OnDisconnect,
} from "socket-controllers";
import { IsDefined, IsInt, IsPositive } from "class-validator";
import { Service } from "typedi";
import { ChannelsRepository } from "../services/repositories/channels";
import { channelCreatedEvent, userJoinedEvent } from "../events/channels";
import { Subscription } from "sub-events";
import { messageCreatedEvent } from "../events/messages";
import { MessagesService } from "../services/messages";
import { getChannelRoom } from "../utils/channels";
import AuthService from "../services/auth";
import { ChannelAction, CHANNEL_NAMESPACE } from "../services/rbac/channels";
import { createRole } from "../utils/rbac";

class MessageDto {
  @IsInt()
  @IsPositive()
  channelId!: number;

  @IsDefined()
  text!: string;
}

@SocketController()
@Service()
export class MessageController {
  subs: Subscription[];
  constructor(
    private authService: AuthService,
    private channelsRepository: ChannelsRepository,
    private messagesService: MessagesService
  ) {
    this.subs = [] as Subscription[];
  }

  private async subscribeToRooms(socket: Socket, userId: string) {
    const channelsBatchSize = 100;
    let cursorId = null;
    let channels = await this.channelsRepository.list(
      userId,
      channelsBatchSize
    );
    // TODO: change to generator
    while (channels.length === channelsBatchSize && cursorId !== null) {
      channels.forEach((c) => socket.join(getChannelRoom(c.id)));
      cursorId = channels[channels.length - 1];
    }

    // TODO: that's not scalablle
    this.subs.push(
      channelCreatedEvent.subscribe((data) => {
        if (data.creatorId === userId) {
          socket.join(getChannelRoom(data.channelId));
        }
      })
    );
    this.subs.push(
      userJoinedEvent.subscribe((data) => {
        if (data.userId === userId) {
          socket.join(getChannelRoom(data.channelId));
        }
      })
    );
  }

  @OnConnect()
  connect(@ConnectedSocket() socket: Socket) {
    console.log("Connected");
    //@ts-ignore
    const userId = socket.userId;
    this.subscribeToRooms(socket, userId);

    // TODO: that's not scalablle
    messageCreatedEvent.subscribe((data) => {
      if (userId === data.userId) {
        socket.to(getChannelRoom(data.channelId)).emit("message:created", {
          messageId: data.messageId,
          userId: data.userId,
          text: data.text,
          channelId: data.channelId,
        });
      }
    });
  }

  @OnDisconnect()
  disconnect() {
    console.log("Disconnected");
    this.subs.forEach((s) => s.cancel());
  }

  @OnMessage("message")
  sendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: MessageDto
  ) {
    //@ts-ignore
    const userId = socket.userId;

    const isAllowed = this.authService.authorize(
      userId,
      message.channelId.toString(),
      [createRole(CHANNEL_NAMESPACE, ChannelAction.WRITE)]
    );
    if (!isAllowed) {
      socket.emit("message:error", {
        message:
          "You don't have enough permission to create message in that channel",
      });
      return;
    }
    this.messagesService.create(userId, message.channelId, message.text);
  }
}

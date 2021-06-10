import { Server, Socket } from "socket.io";
import {
  ConnectedSocket,
  OnConnect,
  OnMessage,
  SocketController,
  MessageBody,
  OnDisconnect,
  NamespacedIO,
} from "socket-controllers";
import { IsDefined, IsInt, IsPositive } from "class-validator";
import { Service } from "typedi";
import { ChannelsRepository } from "../services/repositories/channels";
import {
  channelCreatedEvent,
  userDeletedEvent,
  userJoinedEvent,
} from "../events/channels";
import { Subscription } from "sub-events";
import { messageCreatedEvent } from "../events/messages";
import { MessagesService } from "../services/messages";
import { getChannelRoom } from "../utils/channels";
import AuthService from "../services/auth";
import { ChannelAction, CHANNEL_NAMESPACE } from "../services/rbac/channels";
import { createRole } from "../utils/rbac";
import { Logger, LoggerInterface } from "../decorators/logger";

class MessageDto {
  @IsInt()
  @IsPositive()
  channelId!: number;

  @IsDefined()
  text!: string;
}

@SocketController("/messages")
@Service()
export class MessageController {
  subs: Subscription[];
  constructor(
    @Logger() private logger: LoggerInterface,
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
      channels.forEach((c) => {
        const channelRoom = getChannelRoom(c.id);
        this.logger.info("User joined to room", { channelRoom });
        socket.join(channelRoom);
      });
      cursorId = channels[channels.length - 1];
    }

    // TODO: that's not scalable because events sent throught local event bus
    this.subs.push(
      channelCreatedEvent.subscribe((data) => {
        this.logger.info("Received channel created event", { data, userId });
        if (data.creatorId === userId) {
          const channelRoom = getChannelRoom(data.channelId);
          this.logger.info("User joined to room", { channelRoom, userId });
          socket.join(channelRoom);
        }
      })
    );
    this.subs.push(
      userJoinedEvent.subscribe((data) => {
        if (data.userId === userId) {
          const channelRoom = getChannelRoom(data.channelId);
          this.logger.info("User joined to room", { channelRoom, userId });
          socket.join(channelRoom);
        }
      })
    );
    this.subs.push(
      userJoinedEvent.subscribe((data) => {
        if (data.userId === userId) {
          const channelRoom = getChannelRoom(data.channelId);
          this.logger.info("User joined to room", { channelRoom, userId });
          socket.join(channelRoom);
        }
      })
    );
    this.subs.push(
      userDeletedEvent.subscribe((data) => {
        if (data.userId === userId) {
          const channelRoom = getChannelRoom(data.channelId);
          this.logger.info("User leaved to room", { channelRoom, userId });
          socket.leave(channelRoom);
        }
      })
    );
  }

  @OnConnect()
  async connect(
    @NamespacedIO() namespacedIo: Server,
    @ConnectedSocket() socket: Socket
  ) {
    this.logger.info("New user connected to socket");
    // TODO: move authenticcation logic out of namespaced controller
    // maybe have to implement same auth level as in routing controllers
    const authHeader = socket.handshake.headers["authorization"];
    const user = await this.authService.getCurrentUser(authHeader);
    if (user === null) {
      this.logger.info("User unauthorized to socket");
      return;
    }
    const userId = user.id;
    this.logger.info("User connected to socket", { userId });
    // TODO: create type with userId in socket
    //@ts-ignore
    socket.userId = userId;
    this.subscribeToRooms(socket, userId);

    // TODO: that's not scalablle
    messageCreatedEvent.subscribe((data) => {
      this.logger.info("Received message created event", { data, userId });
      if (userId === data.userId) {
        const channelRoom = getChannelRoom(data.channelId);
        namespacedIo.to(channelRoom).emit("message:created", {
          messageId: data.messageId,
          userId: data.userId,
          text: data.text,
          channelId: data.channelId,
        });
        this.logger.info("Emitted message:created event to room", {
          userId,
          channelRoom,
        });
      }
    });
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: Socket) {
    this.logger.info("User disconnected from socket", {
      // @ts-ignore
      userId: socket.userId,
    });
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

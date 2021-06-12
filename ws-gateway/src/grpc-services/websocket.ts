import * as grpc from "@grpc/grpc-js";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { IWebsocketsServer } from "./../proto/ws_grpc_pb";
import {
  AddToRoomRequest,
  RemoveFromRoomRequest,
  EmitMessageRequest,
} from "./../proto/ws_pb";
import Logger from "./../logger";
import { UsersService } from "../services/users";
import Container from "typedi";
import { RedisAdapter } from "@socket.io/redis-adapter";
import { Emitter } from "@socket.io/redis-emitter";

export class WebsocketsServer implements IWebsocketsServer {
  // https://github.com/agreatfool/grpc_tools_node_protoc_ts#510
  [name: string]: grpc.UntypedHandleCall;
  async addToRoom(
    call: grpc.ServerUnaryCall<AddToRoomRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): Promise<void> {
    const usersService = Container.get(UsersService);
    const io = Container.get(Emitter);
    const addToRoomRequest = call.request;

    const userId = addToRoomRequest.getUserId();
    const socketId = await usersService.getUserSocket(userId);
    if (socketId) {
      try {
        const room = addToRoomRequest.getRoom();
        io.of(addToRoomRequest.getNamespace())
          .in(socketId)
          .socketsJoin(addToRoomRequest.getRoom());
        Logger.info("Socket joined to room", {
          userId,
          socketId,
          room,
        });
      } catch (e) {
        Logger.info("Socket to join not found", {
          userId,
          socketId,
        });
      }
    } else {
      Logger.info("Socket to join not found", {
        userId,
        socketId,
      });
    }
    callback(null, new Empty());
  }
  async removeFromRoom(
    call: grpc.ServerUnaryCall<RemoveFromRoomRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): Promise<void> {
    const removeFromRoom = call.request;
    const usersService = Container.get(UsersService);
    const io = Container.get(Emitter);
    const userId = removeFromRoom.getUserId();
    const socketId = await usersService.getUserSocket(userId);
    if (socketId) {
      try {
        io.of(removeFromRoom.getNamespace())
          .in(socketId)
          .socketsJoin(removeFromRoom.getRoom());
      } catch (e) {
        Logger.info("Socket to join not found", {
          userId,
          socketId,
        });
      }
    }
    callback(null, new Empty());
  }
  emitMessage(
    call: grpc.ServerUnaryCall<EmitMessageRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): void {
    const emitMessageRequest = call.request;
    const io = Container.get(Emitter);
    let sender: Emitter = io;
    const namespace = emitMessageRequest.getNamespace();
    if (namespace) {
      sender = io.of(namespace);
    }
    if (emitMessageRequest.getRoom()) {
      sender
        .to(emitMessageRequest.getRoom())
        .emit(
          emitMessageRequest.getEventName(),
          JSON.parse(emitMessageRequest.getPayload())
        );
    }
    callback(null, new Empty());
  }
}

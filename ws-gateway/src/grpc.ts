import * as grpc from "@grpc/grpc-js";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { IWebsocketsServer, WebsocketsService } from "./proto/ws_grpc_pb";
import {
  AddToRoomRequest,
  RemoveFromRoomRequest,
  EmitMessageRequest,
} from "./proto/ws_pb";
import config from "./config";
import Logger from "./logger";

class WebsocketsServer implements IWebsocketsServer {
  // https://github.com/agreatfool/grpc_tools_node_protoc_ts#510
  [name: string]: grpc.UntypedHandleCall;
  addToRoom(
    call: grpc.ServerUnaryCall<AddToRoomRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): void {
    const addToRoomRequest = call.request;
    Logger.info(JSON.stringify(addToRoomRequest));
    callback(null, new Empty());
  }
  removeFromRoom(
    call: grpc.ServerUnaryCall<RemoveFromRoomRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): void {
    const removeFromRoom = call.request;
    Logger.info(JSON.stringify(removeFromRoom));
    callback(null, new Empty());
  }
  emitMessage(
    call: grpc.ServerUnaryCall<EmitMessageRequest, Empty>,
    callback: grpc.sendUnaryData<Empty>
  ): void {
    const emitMessageRequest = call.request;
    Logger.info(JSON.stringify(emitMessageRequest));
    Logger.info(JSON.stringify(emitMessageRequest.getPayload()));
    callback(null, new Empty());
  }
}

export async function createGrpcServer(): Promise<grpc.Server> {
  const server = new grpc.Server();
  server.addService(WebsocketsService, new WebsocketsServer());
  return new Promise((resolve, reject) => {
    server.bindAsync(
      `0.0.0.0:${config.grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          reject(err);
        }
        Logger.info("GRPC Server is running", {
          port,
        });
        resolve(server);
      }
    );
  });
}

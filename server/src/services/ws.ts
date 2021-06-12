import * as grpc from "@grpc/grpc-js";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Struct, Value } from "google-protobuf/google/protobuf/struct_pb";
import { Service } from "typedi";
import config from "../config";
import { WebsocketsClient } from "../proto/ws_grpc_pb";
import {
  AddToRoomRequest,
  EmitMessageRequest,
  RemoveFromRoomRequest,
} from "../proto/ws_pb";

@Service()
export class WebsocketsService {
  private websocketsClient: WebsocketsClient;
  private namespace = "/messages";
  constructor() {
    this.websocketsClient = new WebsocketsClient(
      config.wsGatewayGrpcUri,
      grpc.credentials.createInsecure()
    );
  }

  async addToRoom(userId: string, room: string) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new AddToRoomRequest();
      req.setNamespace(this.namespace);
      req.setRoom(room);
      req.setUserId(userId);
      this.websocketsClient.addToRoom(req, (err, resp) => {
        if (err) {
          return reject(err);
        }
        return resolve(resp);
      });
    });
  }
  async emitMessage(room: string, eventName: string, payload: any) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new EmitMessageRequest();
      req.setNamespace(this.namespace);
      req.setRoom(room);
      req.setEventName(eventName);
      // TODO: try struct
      req.setPayload(JSON.stringify(payload));
      this.websocketsClient.emitMessage(req, (err, resp) => {
        if (err) {
          return reject(err);
        }
        return resolve(resp);
      });
    });
  }
  async removeFromRoom(userId: string, room: string) {
    return new Promise<Empty>((resolve, reject) => {
      const req = new RemoveFromRoomRequest();
      req.setNamespace(this.namespace);
      req.setRoom(room);
      req.setUserId(userId);
      this.websocketsClient.removeFromRoom(req, (err, resp) => {
        if (err) {
          return reject(err);
        }
        return resolve(resp);
      });
    });
  }
}

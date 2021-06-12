import { Container } from "typedi";
import * as grpc from "@grpc/grpc-js";

import { WebsocketsServer } from "../grpc-services/websocket";
import { WebsocketsService } from "../proto/ws_grpc_pb";
import config from "../config";
import Logger from "../logger";

export default async function (): Promise<void> {
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
        Container.set(grpc.Server, server);
        resolve();
      }
    );
  });
}

import * as grpc from "@grpc/grpc-js";
import { createServer } from "http";
import { createApplication } from "./app";
import config from "./config";
import { createGrpcServer } from "./grpc";
import Logger from "./logger";

const httpServer = createServer();

createGrpcServer().then((server: grpc.Server) => {
  server.start();
});
createApplication(httpServer).then(() => {
  httpServer.listen(config.port);
  Logger.info("Server is running", {
    port: config.port,
  });
});

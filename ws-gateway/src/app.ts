import { createServer } from "http";
import * as grpc from "@grpc/grpc-js";
import { Container } from "typedi";
import config from "./config";
import Logger from "./logger";
import loadAll from "./loaders";

export async function createApplication() {
  const httpServer = createServer();
  await loadAll({ httpServer });
  const grpcServer = Container.get(grpc.Server);

  return {
    run: () => {
      httpServer.listen(config.port);
      Logger.info("Server is running", {
        port: config.port,
      });
      grpcServer.start();
    },
  };
}

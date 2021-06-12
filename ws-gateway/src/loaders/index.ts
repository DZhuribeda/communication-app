import { Server as HttpServer } from "http";

import Logger from "../logger";
import dependenciesLoader from "./dependencies";
import ioLoader from "./io";
import grpcLoader from "./grpc";

export default async ({ httpServer }: { httpServer: HttpServer }) => {
  dependenciesLoader();
  Logger.info("Dependencies loaded");
  await ioLoader({ httpServer });
  Logger.info("IO loaded");
  await grpcLoader();
  Logger.info("GRPC loaded");
};

import { createServer } from "http";
import { createApplication } from "./app";
import config from "./config";
import Logger from "./logger";

const httpServer = createServer();

createApplication(httpServer).then(() => {
  httpServer.listen(config.port);
  Logger.info("Server is running", {
    port: config.port,
  });
});

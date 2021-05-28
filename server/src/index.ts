import "reflect-metadata";
import config from "./config";
import Logger from "./logger";
import { createServer } from "./app";

createServer().then((httpServer) => {
  httpServer
    .listen(config.port, () => {
      Logger.info("Server is running", {
        port: config.port,
      });
    })
    .on("error", (err: Error) => {
      Logger.error(err);
      process.exit(1);
    });
});

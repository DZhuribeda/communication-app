import "reflect-metadata";
import config from "./config";
import Logger from "./logger";
import { createApp } from "./app";
import express from "express";

createApp().then((app: express.Application) => {
  app.listen(config.port);
  Logger.info("Server is running", {
    port: config.port,
  });
});

import "reflect-metadata";
import express from "express";
import http from "http";
import { useContainer, useSocketServer } from "socket-controllers";
import { Container } from "typedi";
import { Server } from "socket.io";

async function createApp() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require("./loaders").default({ expressApp: app });
  return app;
}

export async function createServer() {
  const app = await createApp();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    path: "/ws/messages/",
  });
  useContainer(Container);
  useSocketServer(io, {
    controllers: [__dirname + '/socketControllers/*.ts'],
    middlewares: [__dirname + '/socketMiddewares/*.ts'],
  });
  return httpServer;
}

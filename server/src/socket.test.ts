import { createServer } from "./app";
import { Server } from "http";
import { AddressInfo } from "net";
import { io, Socket } from "socket.io-client";

const createPartialDone = (count: number, done: () => void) => {
  let i = 0;
  return () => {
    if (++i === count) {
      done();
    }
  };
};

describe("todo management", () => {
  let httpServer: Server, socket: Socket;

  beforeEach((done) => {
    const partialDone = createPartialDone(1, done);

    createServer().then((server) => {
      httpServer = server;
      server.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        socket = io(`http://127.0.0.1:${port}`, {
          path: "/ws/messages",
        });
        socket.on("connect", partialDone);
      });
    });
  });

  afterEach((done) => {
    socket.disconnect();
    httpServer.close();
    done();
  });

  describe("create todo", () => {
    it("should create a todo entity", (done) => {
      // const partialDone = createPartialDone(2, done);
      socket.emit("save");

      socket.on("message_saved", () => {
        done();
      });
    });
  });
});

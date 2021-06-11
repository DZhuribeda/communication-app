import { Server as HttpServer } from "http";
import fetch from "node-fetch";
import { Server, ServerOptions, Socket } from "socket.io";
import { loadEventRules } from "./eventRules";
import Logger from "./logger";

function createEventClient(
  socket: Socket,
  url: string,
  extraHeaders?: string[]
) {
  async function send(path: string, payload?: any) {
    const requestPath = `${url}${path}`;
    Logger.debug("Requesting upstream", {
      url: requestPath,
    });
    return fetch(requestPath, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...(extraHeaders
          ? extraHeaders.reduce<{ [key: string]: string }>((acc, header) => {
              const normalizedHeader = header.toLowerCase();
              if (socket.handshake.headers[normalizedHeader]) {
                acc[normalizedHeader] = socket.handshake.headers[
                  normalizedHeader
                ] as string;
              }
              return acc;
            }, {})
          : {}),
      },
    }).then((resp) => {
      if (!resp.ok) {
        Logger.debug("Error during request to upstream", {
          status: resp.status,
        });
      }
    });
  }
  return {
    onConnect: async () => {
      return send("connect/");
    },
    onEvent: async (eventName: string, payload?: any) => {
      return send(`event/${eventName}/`, payload);
    },
  };
}

export async function createApplication(
  httpServer: HttpServer,
  serverOptions: Partial<ServerOptions> = {}
): Promise<Server> {
  const io = new Server(httpServer, {
    path: "/ws/",
    ...serverOptions,
  });
  const eventRules = await loadEventRules();

  for (const eventRule of eventRules) {
    io.of(eventRule.match.namespace).on("connection", (socket) => {
      const eventClient = createEventClient(
        socket,
        eventRule.upstream.url,
        eventRule.upstream.headers
      );
      Logger.info("Socket connected");
      eventClient.onConnect();
      socket.onAny((eventName, ...args) => {
        eventClient.onEvent(eventName, args);
      });
    });
  }

  return io;
}

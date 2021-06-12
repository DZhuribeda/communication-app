import faker from "faker";
import { io, Socket } from "socket.io-client";
import { createChannel } from "../tools/channels";
import { TEST_CONFIG } from "../tools/config";
import { createAuthorizedUser, AuthorizedUser } from "../tools/user";

let socket: Socket;
let authorizedUser: AuthorizedUser;

beforeEach((done) => {
  createAuthorizedUser().then((user) => {
    authorizedUser = user;
    socket = io(`${TEST_CONFIG.base_url}/messages`, {
      path: "/ws/",
      transports: ["websocket"],
      extraHeaders: {
        Authorization: `Bearer ${authorizedUser.token}`,
      },
      withCredentials: true,
    });
    console.log(user);
    socket.on("connect", done);
  });
});

afterEach((done) => {
  socket.disconnect();
  done();
});

test("send messages", (done) => {
  createChannel(authorizedUser.token).then((channel) => {
    expect(channel.id).toBeDefined();

    socket.emit("message", {
      channelId: channel.id,
      text: faker.lorem.sentence(10),
    });

    socket.on("message:created", () => {
      done();
    });
  });
});

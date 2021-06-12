import faker from "faker";
import { io, Socket } from "socket.io-client";
import { addChannelMember, removeChannelMember } from "../tools/channelMembers";
import { createChannel } from "../tools/channels";
import { TEST_CONFIG } from "../tools/config";
import { createPartialDone } from "../tools/socket";
import { createAuthorizedUser, AuthorizedUser } from "../tools/user";

let socketAuthor: Socket;
let author: AuthorizedUser;
let socketGuest: Socket;
let guest: AuthorizedUser;

beforeEach((done) => {
  const partialDone = createPartialDone(2, done);
  createAuthorizedUser()
    .then((user) => {
      author = user;
      socketAuthor = io(`${TEST_CONFIG.base_url}/messages`, {
        path: "/ws/",
        transports: ["websocket"],
        extraHeaders: {
          Authorization: `Bearer ${author.token}`,
        },
        withCredentials: true,
      });
      console.log(user);
      socketAuthor.on("connect", partialDone);
      return createAuthorizedUser();
    })
    .then((user) => {
      guest = user;
      socketGuest = io(`${TEST_CONFIG.base_url}/messages`, {
        path: "/ws/",
        transports: ["websocket"],
        extraHeaders: {
          Authorization: `Bearer ${guest.token}`,
        },
        withCredentials: true,
      });
      console.log(user);
      socketGuest.on("connect", partialDone);
    });
});

afterEach((done) => {
  socketAuthor.disconnect();
  socketGuest.disconnect();
  done();
});

test("guest can receive messages", (done) => {
  const partialDone = createPartialDone(4, done);
  let channelId: number;

  socketAuthor.on("message:created", () => {
    partialDone();
  });
  socketGuest.on("message:created", () => {
    partialDone();
  });
  createChannel(author.token)
    .then((channel) => {
      channelId = channel.id;
      expect(channelId).toBeDefined();

      socketAuthor.emit("message", {
        channelId,
        text: faker.lorem.sentence(10),
      });
      return addChannelMember(author.token, channelId, guest.id, "WRITER");
    })
    .then(() => {
      socketAuthor.emit("message", {
        channelId,
        text: faker.lorem.sentence(10),
      });
      return removeChannelMember(author.token, channelId, guest.id);
    })
    .then(() => {
      socketAuthor.emit("message", {
        channelId,
        text: faker.lorem.sentence(10),
      });
    });
});

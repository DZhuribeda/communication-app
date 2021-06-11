import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";
import config from "../lib/config";
import { getCurrentUserIdentity } from "../lib/kratos";



type NewSocketOpts = {
  onMessage: (event: MessageEvent) => void;
};

const newSocket = (addr: string, opts: NewSocketOpts): WebSocket => {
  console.log(opts);
  const socket = new WebSocket(addr);
  socket.onopen = () => {
      console.log("Successfully Connected");
  };

  socket.onclose = event => {
      console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = error => {
      console.log("Socket Error: ", error);
  };

  socket.onmessage = (event) => {
    opts.onMessage(event);
  }

  return socket;
}

const WsView = () => {
  const [socket, setSocket] = React.useState(null);
  const [msg, setMsg] = React.useState<MessageEvent>(null);

  React.useEffect(() => {
    setSocket(newSocket('ws://127.0.0.1:8080/ws', {
      onMessage: setMsg
  }));
  }, []);


  const sendPing = () => socket.send('Ping!');

  return (
    <div>
      <button type="button" onClick={sendPing}>Ping WS</button>
      {msg && <div>{msg.data}</div>}
    </div>
  );
}

export default function Home({ user }) {
  return (
    <div>
      <div>
        Welcome{" "}
        {user ? `${user?.traits.name.first} ${user?.traits.name.last}` : null}
      </div>
      <WsView />
      {user ? (
        <a href={`${config.kratos.browser}/self-service/browser/flows/logout`}>
          Log out
        </a>
      ) : (
        <>
          <Link href="/auth/registration">Register</Link>
          <Link href="/auth/login">Login</Link>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      user: await getCurrentUserIdentity(context),
    },
  };
}

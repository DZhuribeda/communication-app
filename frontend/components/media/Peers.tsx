import React from "react";
import { Peer } from "./Peer";
import { useStore } from "../../libs/store/useStore";

export function Peers() {
  const peers = useStore((state) => state.peers);
  return (
    <div data-component="Peers">
      {" "}
      {peers.map((peer) => (
        <Peer key={peer.id} id={peer.id} />
      ))}
    </div>
  );
}

import produce from "immer";
import { SetState, GetState } from "zustand";
import { AppState } from "./useStore";

type Peer = {
  id: string;
  displayName: string;
};

export interface PeersSlice {
  peers: Peer[];
  addPeer: (peer: Peer) => void;
  removePeer: (peerId: string) => void;
}

export const createPeersSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>
) => ({
  peers: [],
  addPeer: (newPeer: Peer) => {
    set((state) => ({
      ...state,
      peers: [...state.peers, newPeer],
    }));
  },
  removePeer: (peerId: string) => {
    set(
      produce((state: AppState) => {
        state.peers = state.peers.filter((peer) => peer.id !== peerId);
      })
    );
  },
});

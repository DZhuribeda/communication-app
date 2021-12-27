
import type { NextPage } from "next";
import { useEffect } from "react";
import { Peers } from "../components/media/Peers";
import { useStore } from "../libs/store/useStore";
import { SelfView } from "./../components/media/SelfView";

const Home: NextPage = () => {
  const joinToRoom = useStore(state => state.joinToRoom);
  useEffect(() => {
    joinToRoom();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div>
        You
        <SelfView />
      </div>
      <div>
        Peers
        <Peers />
      </div>
    </div >
  );
};

export default Home;

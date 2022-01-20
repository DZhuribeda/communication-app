import type { NextPage } from "next";
import { useEffect } from "react";
import { Layout } from "../../components/layout/layout";
import { MediaRoom } from "../../components/rooms/media-room";
import { RoomState } from "../../libs/entities/room";
import { useStore } from "../../libs/store/useStore";
import { withAuthorizedUser } from "../../libs/user";

const MediaRoomPage: NextPage = () => {
  const roomState = useStore((state) => state.roomState);
  const resetRoom = useStore((state) => state.resetRoom);
  useEffect(() => {
    return () => {
      resetRoom();
    };
  }, [resetRoom]);
  if (roomState === RoomState.configuration) {
    return (
      <Layout title="Enter room">
        <MediaRoom />
      </Layout>
    );
  }
  return <div>MediaRoom here</div>;
};

export default MediaRoomPage;

export const getServerSideProps = withAuthorizedUser();

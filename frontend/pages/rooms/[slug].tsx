import type { NextPage } from "next";
import { Layout } from "../../components/layout/layout";
import { MediaRoom } from "../../components/rooms/media-room";
import { withAuthorizedUser } from "../../libs/user";

const MediaRoomPage: NextPage = () => (
  <Layout title="Enter room">
    <MediaRoom />
  </Layout>
);

export default MediaRoomPage;

export const getServerSideProps = withAuthorizedUser();

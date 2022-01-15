import type { NextPage } from "next";
import { Size } from "../../components/core/general";
import { Link } from "../../components/core/link/link";
import { Layout } from "../../components/layout/layout";
import { RoomsList } from "../../components/rooms/list";
import { withAuthorizedUser } from "../../libs/user";


const Home: NextPage = () => (
  <Layout title="Rooms" actions={<div>
    <Link size={Size.xxl} href="/rooms/new">
      Create a room
    </Link>
  </div>}>
    <RoomsList />
  </Layout>
);

export default Home;

export const getServerSideProps = withAuthorizedUser();

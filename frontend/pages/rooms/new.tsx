import type { NextPage } from "next";
import { Layout } from "../../components/layout/layout";
import { CreateRoomForm } from "../../components/rooms/create-form";
import { withAuthorizedUser } from "../../libs/user";

const NewRoomPage: NextPage = () => {
  return (
    <Layout title="New Room">
      <CreateRoomForm />
    </Layout>
  );
};

export default NewRoomPage;

export const getServerSideProps = withAuthorizedUser();

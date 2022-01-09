import type { NextPage } from "next";
import { Layout } from "../components/layout/layout";
import { withAuthorizedUser } from "../libs/user";

const Home: NextPage = () => {
  return (
    <Layout title="Rooms">
      {/* Replace with your content */}
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
      </div>
      {/* /End replace */}
    </Layout>
  );
};

export default Home;

export const getServerSideProps = withAuthorizedUser();

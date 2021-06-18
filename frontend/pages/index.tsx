import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import config from "../lib/config";
import { getCurrentUserIdentity } from "../lib/kratos";

export default function Home({ user }) {
  return (
    <div>
      <div>
        Welcome{" "}
        {user ? `${user?.traits.name.first} ${user?.traits.name.last}` : null}
      </div>
      {user ? (
        <a href={`${config.kratos.public}/self-service/browser/flows/logout`}>
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

import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import config from "@lib/config";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { prefetchUser, userAtom, useUser } from "@lib/store/user";
import { useAtom } from "jotai";

export default function Home() {
  const user = useUser();
  // const [user] = useAtom(userAtom)
  console.log(user);
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
  const queryClient = new QueryClient();
  await prefetchUser(queryClient, context);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

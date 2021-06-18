import { GetServerSidePropsContext } from "next";
import { QueryClient, useQuery } from "react-query";

import { kratos } from "@lib/auth/kratos";
import config from "@lib/config";

export async function prefetchUser(
  queryClient: QueryClient,
  context: GetServerSidePropsContext
) {
  await queryClient.prefetchQuery("user", async () => {
    try {
      const { data } = await kratos.whoami(
        context?.req.headers.cookie,
        context?.req.headers.authorization
      );
      return data?.identity as User;
    } catch (e) {}
    return null;
  });
}

export interface User {
  id: string;
  traits: {
    email: string;
    name: {
      first: string;
      last: string;
    };
  };
}

export function useUser() {
  const { data } = useQuery("user", () =>
    fetch(`${config.kratos.public}/sessions/whoami`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        return (data?.identity as User) ?? null;
      })
  );
  console.log(data);
  return data;
}

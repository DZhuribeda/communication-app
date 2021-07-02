import { GetServerSidePropsContext } from "next";
import { QueryClient, useQuery } from "react-query";

import { kratos } from "@lib/auth/kratos";
import config from "@lib/config";
import { UnauthorizedUser } from "@lib/exceptions";

export async function prefetchUser(
  queryClient: QueryClient,
  context: GetServerSidePropsContext,
  options = {
    required: true,
  }
) {
  try {
    const { data } = await kratos.whoami(
      context?.req.headers.cookie,
      context?.req.headers.authorization
    );
    if (options.required && data == null) {
      throw new UnauthorizedUser();
    }
    queryClient.setQueryData("user", data?.identity as User);
  } catch (e) {
    throw new UnauthorizedUser();
  }
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
  return data;
}

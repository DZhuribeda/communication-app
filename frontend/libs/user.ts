import { Session } from "@ory/kratos-client";
import { GetServerSidePropsContext } from "next";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { kratos, kratosServer } from "./auth/kratos";

const USER_KEY = "user";
const LOGOUT_KEY = "logout";

export async function fetchUser(): Promise<Session> {
  const resp = await kratos.toSession();
  return resp.data;
}

export async function fetchLogout(): Promise<string> {
  const resp = await kratos.createSelfServiceLogoutFlowUrlForBrowsers();
  return resp.data.logout_url;
}

// Data prefetched on server-side
export function useUser() {
  return useQuery(USER_KEY, fetchUser, { enabled: false });
}

// Data prefetched on server-side
export function useLogout() {
  const { data } = useQuery(LOGOUT_KEY, fetchLogout, { enabled: false });
  return data || "";
}

export async function getUserFromContext(ctx: GetServerSidePropsContext) {
  const resp = await kratosServer.toSession(
    ctx.req.headers.authorization,
    ctx.req.headers.cookie
  );
  return resp.data;
}

export async function getLogoutUrlFromContext(ctx: GetServerSidePropsContext) {
  const resp = await kratosServer.createSelfServiceLogoutFlowUrlForBrowsers(
    ctx.req.headers.cookie
  );
  return resp.data.logout_url;
}

export function withAuthorizedUser(
  dataFetcher?: (context: GetServerSidePropsContext) => Promise<void>
) {
  return async (context: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(USER_KEY, () =>
      getUserFromContext(context)
    );
    await queryClient.prefetchQuery(LOGOUT_KEY, () =>
      getLogoutUrlFromContext(context)
    );
    const user = queryClient.getQueryData(USER_KEY);
    if (!user) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    if (!dataFetcher) {
      return {
        props: {
          dehydratedState: dehydrate(queryClient),
        },
      };
    }
    return await dataFetcher(context);
  };
}

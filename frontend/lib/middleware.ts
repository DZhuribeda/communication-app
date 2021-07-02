import { GetServerSidePropsContext } from "next";
import { UnauthorizedUser } from "./exceptions";

export const handleUnauthorizedUser =
  (func: (context: GetServerSidePropsContext) => Promise<any>) =>
  async (context: GetServerSidePropsContext) => {
    try {
      return await func(context);
    } catch (e) {
      if (e instanceof UnauthorizedUser) {
        return {
          redirect: {
            destination: `/auth/login`,
            permanent: false,
          },
        };
      }
    }
  };

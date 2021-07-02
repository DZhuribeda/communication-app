import { GetServerSidePropsContext } from "next";
import { dehydrate } from "react-query/hydration";
import { prefetchUser } from "@lib/store/user";
import { createQueryClient } from "@lib/query-client";
import Layout from "@components/Layout/Layout";
import { handleUnauthorizedUser } from "@lib/middleware";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

export default function Channels() {
  return (
    <Layout title="Channels">
      <Container maxWidth="md">
        <Grid container spacing={4}>
          {[0, 1, 2].map((i) => (
            <Grid item key={i} xs={12}>
              {i}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}

export const getServerSideProps = handleUnauthorizedUser(
  async (context: GetServerSidePropsContext) => {
    const queryClient = createQueryClient();
    await prefetchUser(queryClient, context);
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
);

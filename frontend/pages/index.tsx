import { GetServerSidePropsContext } from "next";
import { dehydrate } from "react-query/hydration";
import { prefetchUser } from "@lib/store/user";
import { createQueryClient } from "@lib/query-client";
import Layout from "@components/Layout/Layout";
import Link from "next/link";
import { handleUnauthorizedUser } from "@lib/middleware";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

const cards = [
  {
    title: "Messages",
    description: "Chat with your friends",
  },
];

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}));
export default function Home() {
  const classes = useStyles();
  return (
    <Layout title="Welcome">
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {cards.map((card) => (
            <Grid item key={card.title} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.title}
                  </Typography>
                  <Typography>{card.description}</Typography>
                </CardContent>
                <CardActions>
                  <Link href="/channels" passHref>
                    <Button size="small" color="primary">
                      View
                    </Button>
                  </Link>
                </CardActions>
              </Card>
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

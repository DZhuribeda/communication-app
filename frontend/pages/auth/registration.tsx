import { GetServerSidePropsContext } from "next";
import { RegistrationFlow } from "@ory/kratos-client";

import config from "@lib/config";
import { kratos } from "@lib/auth/kratos";
import { isString, redirectOnSoftError } from "@lib/auth/sdk";
import { AuthForm } from "@components/AuthForm";
import Link from "@components/Link";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function RegistrationPage({ flow }: { flow: RegistrationFlow }) {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <AuthForm flow={flow} />
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="/auth/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const flow = context.query.flow;

  // The flow is used to identify the login and registration flow and
  // return data like the csrf_token and so on.
  if (!flow || !isString(flow)) {
    console.log("No flow ID found in URL, initializing registration flow.");
    return {
      redirect: {
        destination: `${config.kratos.public}/self-service/registration/browser`,
        permanent: false,
      },
    };
  }
  try {
    const { status, data: dataFlow } =
      await kratos.getSelfServiceRegistrationFlow(flow);
    // TODO: Redirect with error
    if (status !== 200) {
      return {
        redirect: {
          destination: `/`,
          permanent: false,
        },
      };
    }

    return {
      props: {
        flow: dataFlow,
      },
    };
  } catch (e) {
    console.log(e);
    return redirectOnSoftError(e, "/self-service/registration/browser");
  }
}

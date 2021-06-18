import { GetServerSidePropsContext } from "next";
import Link from "next/link";

import config from "../../lib/config";
import { kratos } from "../../lib/kratos";
import { AuthForm } from "../../components/AuthForm";
import { isString, redirectOnSoftError } from "../../lib/helpers/sdk";
import { RegistrationFlow } from "@ory/kratos-client";

export default function RegistrationPage({ flow }: { flow: RegistrationFlow }) {
  return (
    <div className="auth">
      <div className="container" id="registration">
        <h5 className="subheading">
          Welcome to SecureApp! <br />
          Use the form below to sign up:
        </h5>

        <div id="ui">
          {flow.ui.messages ? (
            <div>
              <span>Messages</span>
              {flow.ui.messages.map((m) => (
                <div>
                  {m.type} {m.text}
                </div>
              ))}
            </div>
          ) : null}
          <AuthForm flow={flow} />
        </div>

        <hr className="divider" />

        <div className="alternative-actions">
          <Link href="/auth/login">
            Already have an account? Log in instead
          </Link>
        </div>
      </div>
    </div>
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
      console.log(status)
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
    console.log(e)
    return redirectOnSoftError(e, "/self-service/registration/browser");
  }
}

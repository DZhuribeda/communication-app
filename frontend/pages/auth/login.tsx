import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { LoginFlow } from "@ory/kratos-client";

import config from "@lib/config";
import { kratos } from "@lib/auth/kratos";
import { isString, redirectOnSoftError } from "@lib/auth/sdk";
import { AuthForm } from "@components/AuthForm";

export default function LoginPage({ flow }: { flow: LoginFlow }) {
  return (
    <div className="auth">
      <div className="container" id="registration">
        <h5 className="subheading">Welcome to this example login screen!</h5>

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
          <Link href="/auth/registration">Register new account</Link>
          <Link href="/recovery">Reset password</Link>
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
    console.log('No flow ID found in URL, initializing login flow.');
    return {
      redirect: {
        destination: `${config.kratos.public}/self-service/login/browser`,
        permanent: false,
      },
    };
  }
  try {
    const { status, data: dataFlow } =
      await kratos.getSelfServiceLoginFlow(flow);
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
    return redirectOnSoftError(e, "/self-service/login/browser");
  }
}

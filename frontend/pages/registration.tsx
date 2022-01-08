import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/kratos-client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Import render helpers
import { Flow } from "../components/auth/Flow";
import { handleFlowError } from "../libs/auth/error";
import { Link } from "../components/core/link/link";
// Import the SDK
import { kratos } from "../libs/auth/kratos";
import { Size } from "../components/core/general";

// Renders the registration page
const Registration: NextPage = () => {
  const router = useRouter();

  // The "flow" represents a registration process and contains
  // information about the form we need to render (e.g. username + password)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow>();

  // Get ?flow=... from the URL
  const { flow: flowId, return_to: returnTo } = router.query;

  // In this effect we either initiate a new registration flow, or we fetch an existing registration flow.
  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      kratos
        .getSelfServiceRegistrationFlow(String(flowId))
        .then(({ data }) => {
          // We received the flow - let's use its data and render the form!
          setFlow(data);
        })
        .catch(handleFlowError(router, "registration", setFlow));
      return;
    }

    // Otherwise we initialize it
    kratos
      .initializeSelfServiceRegistrationFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "registration", setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  const onSubmit = (values: SubmitSelfServiceRegistrationFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/registration?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        kratos // We submit the flow
          .submitSelfServiceRegistrationFlow(String(flow?.id), values)
          .then(({ data }) => {
            // If we ended up here, it means we are successfully signed up!
            //
            // You can do cool stuff here, like having access to the identity which just signed up:
            console.log("This is the user session: ", data, data.identity);

            // For now however we just want to redirect home!
            return router.push(flow?.return_to || "/").then(() => { });
          })
          .catch(handleFlowError(router, "registration", setFlow))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <>
      <Head>
        <title>Create account</title>
      </Head>
      <div className="container mx-auto w-96 grid place-items-center h-screen">
        <div className="w-96">
          <h1 className="text-displaySm text-center pb-8">Create account</h1>
          <Flow onSubmit={onSubmit} flow={flow} />
          <div className="pt-8 text-center">
            <span className="text-gray-500 text-sm">Already have an account?</span>
            <Link href="/login" size={Size.md}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;

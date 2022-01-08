import { useState, useCallback } from 'react';
import { getNodeId } from "@ory/integrations/ui";
import { useForm, FormProvider } from "react-hook-form";
import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
  UiNode,
} from "@ory/kratos-client";

import { Messages } from "./Messages";
import { Node } from "./nodes/Node";

export type Values = Partial<
  | SubmitSelfServiceLoginFlowBody
  | SubmitSelfServiceRegistrationFlowBody
  | SubmitSelfServiceRecoveryFlowBody
  | SubmitSelfServiceSettingsFlowBody
  | SubmitSelfServiceVerificationFlowBody
>;

export type Methods =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "link"
  | "lookup_secret";

export type Props = {
  // The flow
  flow?:
  | SelfServiceLoginFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow
  | SelfServiceRecoveryFlow;
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods;
  // Is triggered on submission
  onSubmit: (values: Values) => Promise<void>;
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean;
};

export const Flow = ({
  flow,
  only,
  onSubmit,
  hideGlobalMessages,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const methods = useForm<Values>();
  console.log(methods.formState.isSubmitting);
  console.log(methods.formState.errors);

  const filterNodes = useCallback((): Array<UiNode> => {
    if (!flow) {
      return [];
    }
    return flow.ui.nodes.filter(({ group }) => {
      if (!only) {
        return true;
      }
      return group === "default" || group === only;
    });
  }, [flow, only]);

  const handleSubmit = (data: Values) => {
    // Prevent double submission!
    if (isLoading) {
      return Promise.resolve();
    }

    setIsLoading(true);

    return onSubmit(data).finally(() => {
      // We wait for reconciliation and update the state after 50ms
      // Done submitting - update loading status
      setIsLoading(false);
    });
  };

  // Filter the nodes - only show the ones we want
  const nodes = filterNodes();

  if (!flow) {
    // No flow was set yet? It's probably still loading...
    //
    // Nodes have only one element? It is probably just the CSRF Token
    // and the filter did not match any elements!
    return null;
  }

  return (
    <FormProvider {...methods} >
      <form
        key={flow.id}
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={methods.handleSubmit(handleSubmit)}
        className='grid grid-cols-1 gap-5'
      >
        {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
        {nodes.map((node, k) => {
          const id = getNodeId(node) as keyof Values;
          return (
            <Node
              key={`${id}-${k}`}
              disabled={isLoading}
              node={node}
            />
          );
        })}
      </form>
    </FormProvider>
  );
}

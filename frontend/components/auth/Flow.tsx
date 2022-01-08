import { useState, useEffect, useCallback, FormEvent } from 'react';
import { getNodeId } from "@ory/integrations/ui";
import { isUiNodeInputAttributes } from "@ory/integrations/ui";
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

export type Props<T> = {
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
  onSubmit: (values: T) => Promise<void>;
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean;
};

function emptyState<T>() {
  return {} as T;
}

type State<T> = {
  values: T;
  isLoading: boolean;
};

export const Flow = <T extends Values>({
  flow,
  only,
  onSubmit,
  hideGlobalMessages,
}: Props<T>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [values, setValues] = useState<T>(() => emptyState());

  const initializeValues = useCallback((nodes: Array<UiNode> = []) => {
    // Compute the values
    const values = emptyState<T>();
    nodes.forEach((node) => {
      // This only makes sense for text nodes
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === "button" ||
          node.attributes.type === "submit"
        ) {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return;
        }
        values[node.attributes.name as keyof Values] = node.attributes.value;
      }
    });

    // Set all the values!
    setValues(values);
  }, []);
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
  useEffect(() => {
    initializeValues(filterNodes());
  }, [flow, initializeValues, filterNodes]);

  const handleSubmit = (e: MouseEvent | FormEvent) => {
    // Prevent all native handlers
    e.stopPropagation();
    e.preventDefault();

    // Prevent double submission!
    if (isLoading) {
      return Promise.resolve();
    }

    setIsLoading(true);

    return onSubmit(values).finally(() => {
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
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={handleSubmit}
    >
      {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
      {nodes.map((node, k) => {
        const id = getNodeId(node) as keyof Values;
        return (
          <Node
            key={`${id}-${k}`}
            disabled={isLoading}
            node={node}
            value={values[id]}
            dispatchSubmit={handleSubmit}
            setValue={(value) =>
              setValues(
                (state) => ({
                  ...state,
                  [getNodeId(node)]: value,
                }),
              )
            }
          />
        );
      })}
    </form>
  );
}

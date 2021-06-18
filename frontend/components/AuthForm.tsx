import {
  RegistrationFlow,
  LoginFlow,
  SettingsFlow,
  UiNode,
  UiNodeInputAttributes,
} from "@ory/kratos-client";
import { getNodeName, getNodeTitle } from "@lib/auth/form";

function FormField({ node }: { node: UiNode }) {
  switch (node.type) {
    case "input": {
      const attrs = node.attributes as UiNodeInputAttributes;
      if (attrs.type === "submit") {
        return (
          <div>
            <button
              name={attrs.name}
              type={attrs.type}
              // @ts-ignore
              value={attrs.value}
              disabled={attrs.disabled}
            >
              {getNodeTitle(node)}
            </button>
          </div>
        );
      }
      return (
        <div>
          {attrs.type !== "hidden" ? <label>{getNodeTitle(node)}</label> : null}
          <input
            style={{ border: "1px solid black" }}
            name={attrs.name}
            required={attrs.required}
            type={attrs.type}
            disabled={attrs.disabled}
            // @ts-ignore
            defaultValue={attrs.value}
          />
          {node.messages?.map((m) => (
            <div>
              {m.type} {m.text}
            </div>
          ))}
        </div>
      );
    }
    default: {
      return null;
    }
  }
}

export function AuthForm<
  T extends RegistrationFlow | LoginFlow | SettingsFlow
>({ flow }: { flow: T }) {
  return (
    <form action={flow.ui.action} method={flow.ui.method}>
      {flow.ui.nodes.map((node, k) => {
        const name = getNodeName(node);
        return (
          <FormField
            key={`form-field-${flow.ui.action || ""}-${name}-${k}`}
            node={node}
          />
        );
      })}
    </form>
  );
}

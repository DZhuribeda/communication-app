import { getNodeLabel } from "@ory/integrations/ui";
import { useFormContext } from "react-hook-form";
import { Input } from "../../core/input/input";
import get from "lodash/get";

import { NodeInputProps } from "./helpers";

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { register, formState: { errors } } = useFormContext(); // retrieve all hook methods
  const { node, attributes, disabled } = props;

  return (
    <Input
      id={attributes.name} 
      type={attributes.type}
      {...register(attributes.name, {
        required: attributes.required ? 'This field is required.' : false,
      })}
      disabled={attributes.disabled || disabled}
      label={getNodeLabel(node)}
      error={get(errors, attributes.name)?.message || node.messages.find(({ type }) => type === 'error')?.text}
    />
  );
}

import { getNodeLabel } from "@ory/integrations/ui";
import { useFormContext } from "react-hook-form";
import { Button } from "../../core/button/button";
import { Size } from "../../core/general";
import { NodeInputProps } from "./helpers";

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  const { register } = useFormContext(); // retrieve all hook methods

  return (
    <Button
      {...register(attributes.name, {
        required: attributes.required,
      })}
      type="submit"
      size={Size.md}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
    >
      {getNodeLabel(node)}
    </Button>
    // <>
    //   <button
    //     className="p-2 px-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
    //     name={attributes.name}
    //     value={attributes.value || ""}
    //     disabled={attributes.disabled || disabled}
    //   >
    //     {getNodeLabel(node)}
    //   </button>
    // </>
  );
}

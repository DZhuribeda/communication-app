import { getNodeLabel } from "@ory/integrations/ui";
import { NodeInputProps } from "./helpers";

export function NodeInputSubmit<T>({
  node,
  attributes,
  setValue,
  disabled,
  dispatchSubmit,
}: NodeInputProps) {
  return (
    <>
      <button
        className="p-2 px-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
        name={attributes.name}
        onClick={(e) => {
          // On click, we set this value, and once set, dispatch the submission!
          setValue(attributes.value).then(() => dispatchSubmit(e));
        }}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </button>
    </>
  );
}

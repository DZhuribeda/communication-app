import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  // Render a checkbox.s
  // TODO:
  //   state={
  //     node.messages.find(({ type }) => type === 'error')
  //       ? 'error'
  //       : undefined
  //   }
  return (
    <div className="flex items-start mb-4">
      <input
        id="checkbox-1"
        name={attributes.name}
        aria-describedby="checkbox-1"
        type="checkbox"
        className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded"
        onChange={(e) => setValue(e.target.checked)}
        defaultChecked={attributes.value === true}
        disabled={attributes.disabled || disabled}
      />
      <label
        htmlFor="checkbox-1"
        className="text-sm ml-3 font-medium text-gray-900"
      >
        {getNodeLabel(node)}
      </label>
      {/* {node.messages.map(({ text }) => text).join('\n')} */}
    </div>
  );
}

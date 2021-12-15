import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props;

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  };
  //help={node.messages.length > 0}
  //state={
  //  node.messages.find(({ type }) => type === 'error') ? 'error' : undefined
  //}
  //subtitle={
  //  <>
  //    {node.messages.map(({ text, id }, k) => (
  //      <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
  //        {text}
  //      </span>
  //    ))}
  //  </>
  //}
  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor="default"
        className="text-gray-700 select-none font-medium"
      >
        {node.meta.label?.text}
      </label>
      <input
        id="name"
        className="h-full w-full border-gray-300 px-2 transition-all border-blue rounded-sm"
        type={attributes.type}
        name={attributes.name}
        value={value}
        disabled={attributes.disabled || disabled}
        onClick={onClick}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

import { UiNodeAnchorAttributes } from "@ory/kratos-client";
import { UiNode } from "@ory/kratos-client";

interface Props {
  node: UiNode;
  attributes: UiNodeAnchorAttributes;
}

export const NodeAnchor = ({ node, attributes }: Props) => {
  return (
    <button
      className="p-2 px-5 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300"
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = attributes.href;
      }}
    >
      {attributes.title.text}
    </button>
  );
};

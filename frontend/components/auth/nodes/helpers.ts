import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";

export type ValueSetter = (
  value: string | number | boolean | undefined
) => void;

export interface NodeInputProps {
  node: UiNode;
  attributes: UiNodeInputAttributes;
  disabled: boolean;
}

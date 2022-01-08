import { useFormContext } from "react-hook-form";
import { NodeInputProps } from "./helpers";

export function NodeInputHidden<T>({ attributes }: NodeInputProps) {
  const { register } = useFormContext(); // retrieve all hook methods
  // Render a hidden input field
  return (
    <input
      {...register(attributes.name, {
        value: attributes.value || "true",
      })}
      type={attributes.type}
    />
  );
}

import { createParamDecorator } from "routing-controllers";

export function UserId(options?: { required?: boolean }) {
  return createParamDecorator({
    required: options && options.required ? true : false,
    value: (action) => {
      return action.request.headers["x-user"];
    },
  });
}

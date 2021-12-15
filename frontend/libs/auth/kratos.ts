import { Configuration, V0alpha2Api } from "@ory/kratos-client";

export const kratos = new V0alpha2Api(
  new Configuration({
    basePath: `/api/.ory`,
  })
);

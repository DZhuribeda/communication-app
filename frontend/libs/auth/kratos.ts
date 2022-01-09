import { Configuration, V0alpha2Api } from "@ory/kratos-client";

export const kratos = new V0alpha2Api(
  new Configuration({
    basePath: `/api/.ory`,
  })
);

export const kratosServer = new V0alpha2Api(
  new Configuration({
    basePath: process.env.ORY_KRATOS_URL,
  })
);

import * as nextjs from "@ory/integrations/next-edge";

// We need to export the config.
export const config = nextjs.config;

// And create the Ory Cloud API "bridge".
export default nextjs.createApiHandler({
  fallbackToPlayground: true,
  apiBaseUrlOverride: process.env.ORY_KRATOS_URL,
});

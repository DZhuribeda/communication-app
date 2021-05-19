import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const jwksUri = process.env.JWKS_URI;
if (!jwksUri) {
  throw new Error("JWKS_URI required");
}

export default {
  port: parseInt(process.env.PORT || "", 10),
  log: {
    level: process.env.LOG_LEVEL,
  },

  jwksUri,
};

import express from "express";
import Logger from "../logger";
import expressLoader from "./express";

export default async ({ expressApp }: { expressApp: express.Application }) => {
  await expressLoader({ app: expressApp });
  Logger.info("Express loaded");
};

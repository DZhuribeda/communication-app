import yaml from "js-yaml";
import { readFile } from "fs/promises";

import config from "./config";
import Logger from "./logger";

export interface EventRule {
  upstream: {
    url: string;
    headers?: string[];
  };
  match: {
    namespace: string;
  };
}

export async function loadEventRules(): Promise<EventRule[]> {
  // TODO: add validation
  const doc = yaml.load(
    await readFile(config.eventRules, "utf8")
  ) as EventRule[];

  Logger.info("event rules loaded");
  return doc;
}

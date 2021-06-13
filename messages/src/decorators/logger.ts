import { Container } from "typedi";
import LoggerInstance from "../logger";

export function Logger() {
  return (object: any, propertyName: string, index?: number): void => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => LoggerInstance,
    });
  };
}

export { Logger as LoggerInterface } from "winston";

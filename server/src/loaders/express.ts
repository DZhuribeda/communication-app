import path from "path";
import express from "express";
import { Container } from "typedi";
import { Action, useExpressServer } from "routing-controllers";
import AuthService from "../services/auth";

export default ({ app }: { app: express.Application }) => {
  useExpressServer(app, {
    controllers: [path.dirname(__dirname) + "/controllers/*.ts"],
    authorizationChecker: async (action: Action, roles: string[]) => {
      const authHeader = action.request.headers["authorization"];
      const authService = Container.get(AuthService);
      // TODO: verify roles
      return authService.authorize(authHeader);
    },
    currentUserChecker: async (action: Action) => {
      const authHeader = action.request.headers["authorization"];
      const authService = Container.get(AuthService);
      return authService.getCurrentUser(authHeader);
    },
  });
};

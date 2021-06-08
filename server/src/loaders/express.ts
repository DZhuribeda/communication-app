import path from "path";
import express from "express";
import { Container } from "typedi";
import { Action, useContainer, useExpressServer } from "routing-controllers";
import AuthService from "../services/auth";

export default ({ app }: { app: express.Application }) => {
  useContainer(Container);
  useExpressServer(app, {
    routePrefix: '/api/v1',
    controllers: [path.dirname(__dirname) + "/controllers/*.ts"],
    authorizationChecker: async (action: Action, roles: string[]) => {
      const authHeader = action.request.headers["authorization"];
      if (!authHeader) {
        return false;
      }
      const authService = Container.get(AuthService);
      const user = await authService.getCurrentUser(authHeader);
      if (!user) {
        return false;
      }
      if (roles.length === 0) {
        return true;
      }
      // TODO: Find better way to extract resourceId
      const resourceId = action.request.params.channelId;
      return authService.authorize(user.id, resourceId, roles);
    },
    currentUserChecker: async (action: Action) => {
      const authHeader = action.request.headers["authorization"];
      const authService = Container.get(AuthService);
      return authService.getCurrentUser(authHeader);
    },
  });
};

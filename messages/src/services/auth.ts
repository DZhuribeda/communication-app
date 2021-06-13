import { Service } from "typedi";
import config from "../config";
import jwks, { SigningKey } from "jwks-rsa";
import jwt, { JwtHeader, SigningKeyCallback } from "jsonwebtoken";
import { Logger, LoggerInterface } from "../decorators/logger";
import { User } from "../interfaces/user";
import { BaseRBACService } from "./rbac/rbac";
import { ChannelsRBACService } from "./rbac/channels";
import { splitRole } from "../utils/rbac";

interface Session {
  id: string;
  identity: User;
}

interface DecodedToken {
  session: Session;
}

const jwksClient = jwks({
  jwksUri: config.jwksUri,
});

function getJwtKey(header: JwtHeader, callback: SigningKeyCallback) {
  jwksClient.getSigningKey(
    header.kid,
    function (err: Error | null, key: SigningKey) {
      var signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  );
}

@Service()
export default class AuthService {
  rbacService: BaseRBACService[];
  constructor(
    @Logger() private logger: LoggerInterface,
    private channelsRBACService: ChannelsRBACService
  ) {
    this.rbacService = [this.channelsRBACService];
  }

  private extractToken(authorization?: string) {
    if (!authorization) {
      return null;
    }
    const parts = authorization.split(" ");
    if (parts.length != 2) {
      return null;
    }
    const scheme = parts[0];
    const token = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return token;
    }
    return null;
  }

  private async decodeToken(token: string): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, getJwtKey, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded as DecodedToken);
      });
    });
  }
  private async extractUserFromToken(
    authHeader?: string
  ): Promise<User | null> {
    const token = this.extractToken(authHeader);
    if (!token) {
      return null;
    }
    try {
      const decoded = await this.decodeToken(token);
      return decoded.session.identity;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  public async getCurrentUser(authHeader?: string): Promise<User | null> {
    return this.extractUserFromToken(authHeader);
  }

  private async checkRoles(
    userId: string,
    resourceId: string,
    roles: string[]
  ): Promise<boolean> {
    return (
      await Promise.all(
        roles.map((role) => {
          const [namespace, action] = splitRole(role);
          const service = this.rbacService.find(
            (service) => service.namespace == namespace
          );
          if (!service) {
            return false;
          }
          return service.isAllowedAction(resourceId, action, userId);
        })
      )
    ).some((i) => i);
  }

  public async authorize(
    userId: string,
    resourceId: string,
    roles: string[]
  ): Promise<boolean> {
    return this.checkRoles(userId, resourceId, roles);
  }
}

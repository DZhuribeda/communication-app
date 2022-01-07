import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { Session } from '@ory/kratos-client';
import { ConfigService } from '@nestjs/config';

type Payload = {
  session: Session;
};

const AUTH_HEADER = 'authorization';
const BEARER_AUTH_SCHEME = 'bearer';

const re = /(\S+)\s+(\S+)/;

function parseAuthHeader(hdrValue) {
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
}

function extractFromSocketAuthHeaderAsBearerToken(socket: any) {
  let token = null;
  const headers = socket.handshake.headers;
  if (headers[AUTH_HEADER]) {
    const auth_params = parseAuthHeader(headers[AUTH_HEADER]);
    if (
      auth_params &&
      BEARER_AUTH_SCHEME === auth_params.scheme.toLowerCase()
    ) {
      token = auth_params.value;
    }
  }
  return token;
}

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('JWKS_URI'),
      }),

      jwtFromRequest: extractFromSocketAuthHeaderAsBearerToken,
      algorithms: ['RS256'],
    });
  }

  validate(payload: Payload) {
    return {
      id: payload.session.identity.id,
    };
  }
}

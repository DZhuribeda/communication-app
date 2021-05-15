import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import jwks, { SigningKey } from "jwks-rsa";
import jwt, {JwtHeader, SigningKeyCallback, verify} from "jsonwebtoken";
import { useExpressServer } from 'routing-controllers';
import { JsonController, Get, HeaderParam } from 'routing-controllers';
import { PublicApi, Configuration } from '@ory/kratos-client';

dotenv.config();

const jwksClient = jwks({
  jwksUri: process.env.JWKS_URL || ''
});

function getJwtKey(header: JwtHeader, callback: SigningKeyCallback){
  jwksClient.getSigningKey(header.kid, function(err: Error | null, key: SigningKey) {
    var signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const kratos = new PublicApi(new Configuration({ basePath: process.env.KRATOS_PUBLIC_URL }));

function extractToken(authorization: string) {
  const parts = authorization.split(' ');
  if (parts.length == 2) {
    const scheme = parts[0];
    const credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    } else {
      // if (credentialsRequired) {
      //   return next(new UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' }));
      // } else {
      //   return next();
      // }
      return null;
    }
  } else {
    // return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
    return null;
  }
}

async function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getJwtKey, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  })
}

@JsonController()
export class TestController {
  @Get('/tests')
  async getTest(
    @HeaderParam("authorization") authorization: string,
    @HeaderParam("x-user") userId: string,
  ) {
    let decoded = null;
    const token = extractToken(authorization);
    console.log(token);
    if (token) {
      try {
        decoded = await verifyToken(token);
        console.log(decoded);
      } catch (err) {
        // err
        console.log(err);
      }
    }
    return {
      data: decoded,
      userId,
    };
  }
}

const app = express();

useExpressServer(app, {
  controllers: [TestController],
});
app.listen(5000);
console.log('App listen 5000');
console.log(process.env.KRATOS_PUBLIC_URL)

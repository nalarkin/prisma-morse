/**
 * Handles all JWT authentication throughout application.
 *
 * Request Authorization Header must be in the format `Bearer TOKENSTRING`
 * If JWT lifetime is expired, then JWT authorization will fail.
 */
import fs from 'fs';
import path from 'path';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import { JWTData } from '@/auth/utils';
import { logger } from './logging';

const pathToKey = path.join(__dirname, '..', 'auth', 'token', 'id_rsa_pub.pem');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

/** Data that stored in the JWT Payload on each request with a valid JWT */
export type JWTPayloadRequest = JWTData & {
  exp: number;
  iat: number;
};

/** Configures passport JWT strategy, will validate JWT requests */
export default (passport: { use: (arg0: JwtStrategy) => void }) => {
  logger.debug('configuring passport to use JWT');
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, function (jwt_payload: JWTPayloadRequest, done: VerifiedCallback) {
      // payload info becomes attached to requests throughout express
      // if it reaches this point, it's not expired, so you can assume stored
      // user credentials are still valid
      return done(null, jwt_payload);
    }),
  );
  logger.debug('configuration complete');
};

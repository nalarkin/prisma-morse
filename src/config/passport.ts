import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { JWTData } from '../auth/utils';
import { logger } from './logging';

const pathToKey = path.join(__dirname, '..', 'auth', 'token', 'id_rsa_pub.pem');

// eslint-disable-next-line security/detect-non-literal-fs-filename
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

type JWTPayloadRequest = JWTData & {
  exp: number;
  iat: number;
};

/** Configures passport JWT strategy, will validate JWT requests */
export default (passport: { use: (arg0: JwtStrategy) => void }) => {
  logger.debug('configuring passport to use JWT');
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, function (jwt_payload: JWTPayloadRequest, done) {
      // payload info becomes attached to requests throughout express
      // if it reaches this point, it's not expired, so assume stored credentials
      // are still valid
      return done(null, jwt_payload);
    }),
  );
  logger.debug('configuration complete');
};

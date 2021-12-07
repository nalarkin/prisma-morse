import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import fs from 'fs';
// import { logger } from '../app';
import path from 'path';
import { Request } from 'express';
import prisma from './database';
import { JWTData } from '../auth/utils';
import { logger } from './logging';

const pathToKey = path.join(__dirname, '..', 'auth', 'token', 'id_rsa_pub.pem');

const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
// At a minimum, you must pass these options (see note after this code snippet for more)

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  // ignoreExpiration: false,
};

type JWTPayloadRequest = JWTData & {
  exp: number;
  iat: number;
};

export default (passport: { use: (arg0: JwtStrategy) => void }) => {
  logger.debug('configuring passport to use JWT');
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, function (jwt_payload: JWTPayloadRequest, done) {
      // payload info becomes attached to requests throughout express
      return done(null, jwt_payload);
      // if expired, request refresh token, if refreshed, pull users data again and save into small package
      // below code is called unconditionally, ideally we can reduce these call if we incorperate an access token
      // prisma.user
      //   .findUnique({ where: { id: jwt_payload.sub } })
      //   .then((user) => {
      //     if (user === null) {
      //       return done(null, false);
      //     }
      //     return done(null, user);
      //   })
      //   .catch((err) => {
      //     return done(err, false);
      //   });
    }),
  );
  logger.debug('configuration complete');
};

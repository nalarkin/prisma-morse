import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import fs from 'fs';
import passport, { PassportStatic } from 'passport';
// import { logger } from '../app';
import path from 'path';
import { Request } from 'express';
import prisma from './database';

const pathToKey = path.join(
  __dirname,
  '..',
  'auth',
  'tokens',
  'id_rsa_pub.pem'
);

const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
// At a minimum, you must pass these options (see note after this code snippet for more)

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

export function customExtractor(request: Request) {
  let token = null;
  log.info('inside special function');
  const header = request.get('Authorization');
  if (header && header?.includes(' ')) {
    token = `${header.split(' ')[1]}`;
  }
  // return ExtractJwt.fromAuthHeaderAsBearerToken(request);
  log.info(token);
  return token;
}

export default (passport: { use: (arg0: JwtStrategy) => void }) => {
  log.debug('configuring passport to use JWT');
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      // We will assign the `sub` property on the JWT to the database ID of user
      log.debug(jwt_payload);
      prisma.user
        .findUnique({ where: { id: jwt_payload.sub } })
        .then((user) => {
          if (user === null) {
            return done(null, false);
          }
          return done(null, user);
        })
        .catch((err) => {
          return done(err, false);
        });
    })
  );
  log.debug('configuration complete');
};

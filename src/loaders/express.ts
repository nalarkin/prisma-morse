/**
 * Applies all middleware to the express application.
 *
 * This includes adding authentication (which uses the passport library) and route handlers.
 */
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import type { Application } from 'express';
import { json } from 'express';
import passport from 'passport';
import pinohttp from 'pino-http';
import configPassport from './passport';
import { loadRoutes } from './routes';

config(); // Make sure environment variables are loaded

/**
 * Add all the middleware to the provided express app.
 *
 * @param {Application} app the express application
 */
export function loadExpress({ app }: { app: Application }) {
  app.use(json());

  app.use(cookieParser()); // used for JWT refresh tokens

  configPassport(passport); // add passport JWT authentication middleware
  app.use(passport.initialize()); // add the configured passport to express app

  const USE_PINO = process.env.LOGGER === 'PINO' || false;
  if (USE_PINO) {
    app.use(pinohttp());
  }

  app.use('/api', loadRoutes()); // apply all route handlers to the express app
}

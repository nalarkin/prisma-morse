/**
 * Creates the express application with the default settings that will be used
 * in the application. Applies all the loaders to the app, then exports the app
 * to allow easy access for testing.
 */
import express from 'express';
import { loadExpress } from './express';

const app = express();
loadExpress({ app });

export { app };
export * from './swagger';

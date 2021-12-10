import dotenv from 'dotenv';
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import { logger } from './config/logging';
import { loadExpress } from './loaders/express';

/** Make sure environment variables are loaded */
dotenv.config();

/** Main method to start the server. */
async function startServer() {
  const app = express();
  loadExpress({ app });

  /** Start listening on port */
  app.listen(8000, () =>
    logger.info(`
    Server ready at: http://localhost:8000 
    Users: http://localhost:8000/users
    Serializables: http://localhost:8000/serializables
    Consumables: http://localhost:8000/consumables
    `),
  );
}

startServer();

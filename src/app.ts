/**
 * This file is what gets called to start the express server, which will handle the http requests.
 */

import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import { logger } from '@/loaders/logging';
import { app } from './loaders';

/** Make sure environment variables are loaded */
config();

/** Main method to start the server. */
async function startServer() {
  /** Start listening on port */
  const PORT = Number(process.env.PORT) || 8000;
  app.listen(PORT, () =>
    logger.info(`
    Server ready at: http://localhost:${PORT} 
    Users: http://localhost:${PORT}/users/
    Serializables: http://localhost:${PORT}/serializables/
    Consumables: http://localhost:${PORT}/consumables/
    Environment: '${process.env.NODE_ENV}'
    `),
  );
}

startServer();

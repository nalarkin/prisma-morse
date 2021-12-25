/**
 * This file is what gets called to start the express server, which will handle the http requests.
 */

import { config } from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pinohttp from 'pino-http';
import { logger } from '@/loaders/logging';
import { app } from './loaders';

config(); // Make sure environment variables are loaded

/** Main method to start the server. */
async function startServer() {
  // Prioritize Environment PORT variable over the default port `8000`
  const PORT = Number(process.env.PORT) || 8000;

  // Start listening on port
  app.listen(PORT, () =>
    logger.info(`
    Server ready at: http://localhost:${PORT}/api/ 
    Users: http://localhost:${PORT}/api/users/
    Serializables: http://localhost:${PORT}/api/serializables/
    Consumables: http://localhost:${PORT}/api/consumables/
    Environment: '${process.env.NODE_ENV}'
    `),
  );
}

startServer();

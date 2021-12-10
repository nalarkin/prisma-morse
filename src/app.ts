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

import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import users from './users/index';
import serializables from './serializables/index';
import consumables from './consumables/index';
import login from './auth/login/index';
import pinohttp from 'pino-http';
import pino from 'pino';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// app.use(pinohttp()); /** Uncomment if you want to see detailed http debug info*/

app.use('', users);
app.use('', serializables);
app.use('', consumables);
app.use('', login);

export const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const server = app.listen(8000, () =>
  console.log(`
    Server ready at: http://localhost:8000
    See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);

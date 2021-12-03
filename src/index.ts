import { Prisma, PrismaClient } from '@prisma/client';
import express from 'express';
import users from './users/index';
import serializables from './serializables/index';
import consumables from './consumables/index';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.use('', users);
app.use('', serializables);
app.use('', consumables);

const server = app.listen(8000, () =>
  console.log(`
🚀 Server ready at: http://localhost:8000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);

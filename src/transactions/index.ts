import express from 'express';
import { createResponse } from '../common/response';
import prisma from '../config/database';

const router = express.Router();

/** Example of only sending a few values from the relational data that was included. */
router.get('/transactions', async function (req, res) {
  const transactions = await prisma.transaction.findMany({
    include: {
      User: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });
  res.json(createResponse({ data: transactions }));
});

export default router;

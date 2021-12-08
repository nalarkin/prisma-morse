import express from 'express';
import passport from 'passport';
import { createResponse } from '../common/response';
import prisma from '../config/database';

const router = express.Router();

/** Example of only sending a few values from the relational data that was included. */
router.get('/', async function (req, res) {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      consumable: true,
      serializable: true,
    },
  });
  res.json(createResponse({ data: transactions }));
});

/** Delete all transactions, used for debugging. */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const transactions = await prisma.transaction.deleteMany();
  res.json(createResponse({ data: transactions }));
});

export default router;

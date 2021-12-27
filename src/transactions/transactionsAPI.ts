import passport from 'passport';
import { Router } from 'express';
import prisma from '../loaders/database';

const router = Router();

/** Example of only sending a few values from the relational data that was included. */
router.get('/', async function (req, res, next) {
  try {
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
    return res.json(transactions);
  } catch (e) {
    next(e);
  }
});

/** Delete all transactions, used for debugging. */
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.deleteMany();
    return res.json(transactions);
  } catch (e) {
    next(e);
  }
});

export default router;

import { Router } from 'express';
import passport from 'passport';
import { Transaction } from '@prisma/client';
import { NewConsumable, TakeConsumable } from '@/common/schema';
import { ajv, SCHEMA, verifyCUIDMiddleware, getRequireAdminMiddleware } from '@/common';
import { JWTData } from '@/auth/utils';
import prisma from '@/loaders/database';
import createError from 'http-errors';

const router = Router();

/** Get all consumables */
router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res) {
  return res.json(await prisma.consumable.findMany());
});

/** Create a consumable */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  getRequireAdminMiddleware('You do not have permission to create consumables'),
  async function (req, res, next) {
    try {
      const validator = ajv.getSchema<NewConsumable>(SCHEMA.CONSUMABLE_NEW);
      const body = req.body;
      const { sub: userId } = req.user as JWTData;

      if (validator === undefined) {
        throw createError(500, 'Unable to get json validator');
      }
      if (!validator(body)) {
        throw createError(400, ajv.errorsText(validator.errors));
      }
      // we can be certain data is safe to use because we used ajv to verify
      const { name, count, description, guide, photo } = body;
      // nested write creates a transaction only if we successfully created the item
      const consumable = await prisma.consumable.create({
        data: {
          name,
          count,
          description,
          guide,
          photo,
          transactions: {
            create: {
              type: 'CREATE',
              userId,
            },
          },
        },
      });
      return res.json(consumable);
    } catch (err) {
      next(err);
    }
  },
);

/** Use item id verification for every request that provides an id param */
router.use('/:id/', verifyCUIDMiddleware);
/**
 * Delete a consumable. Need to decide on deletion tracking method. Cascade delete
 * is necessary? Maybe move it into a new table?
 * @TODO: find way to delete item while retaining history and users
 * */
router.delete(
  '/:id/',
  passport.authenticate('jwt', { session: false }),
  getRequireAdminMiddleware('You do not have permission to delete items'),
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const deleteAction = prisma.consumable.delete({
        where: {
          id: id,
        },
      });
      const [deleteResult] = await prisma.$transaction([deleteAction]);
      return res.json(deleteResult);
    } catch (err) {
      next(err);
    }
  },
);

/** Get a single specific consumable, show transaction history as well */
router.get('/:id/', async function (req, res, next) {
  try {
    const { id } = req.params;
    const consumable = await prisma.consumable.findUnique({
      where: {
        id: id,
      },
      include: {
        transactions: true,
      },
    });
    if (consumable === null) {
      throw createError(404, 'Consumable does not exist');
    }
    return res.json(consumable);
  } catch (e) {
    next(e);
  }
});

/** Consume a given amount of a single consumable */
router.put('/:id/take/', async function (req, res) {
  const { id } = req.params;
  const consumable = await prisma.consumable.update({
    where: {
      id: id,
    },
    data: {
      count: {
        decrement: 3,
      },
    },
  });
  return res.json(consumable);
});

/** Consume a given amount of a single consumable and add into transaction table */
router.put('/:id/take/track/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
  try {
    // used to validate json
    const validator = ajv.getSchema<TakeConsumable>(SCHEMA.CONSUMABLE_TAKE);
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData; // get requester userid from passport
    if (validator === undefined) {
      throw createError(500, 'Unable to get validator to parse json');
    }
    if (!validator(req.body)) {
      throw createError(400, ajv.errorsText(validator.errors));
    }

    const { count } = req.body;
    const takeConsumable = prisma.consumable.update({
      where: {
        id: id,
      },
      data: {
        count: {
          decrement: count,
        },
      },
    });
    const addTransaction = createTransaction(id, userId, 'CONSUME');
    // if one fails, both do not get completed.
    const [consumeResult, transactionResult] = await prisma.$transaction([takeConsumable, addTransaction]);
    return res.json({ consumeResult, transactionResult });
  } catch (err) {
    next(err);
  }
});

/** Helper function to create a transaction */
function createTransaction(consumableId: string, userId: number, type: Transaction['type']) {
  return prisma.transaction.create({
    data: {
      consumableId,
      userId,
      type,
    },
  });
}

// /**
//  * Function that ensures type safety and validation before adding to database
//  *
//  * Note on types. It says string | null but I think is actually string | undefined.
//  * It produces slightly different behavior in Prisma. To get a different type, the ajv
//  * type definition needs to change so instead of string | null it's string | undefined.
//  */
// const createUserAndPost = (
//   name: string,
//   count: number,
//   description: string | null,
//   guide: string | null,
//   photo: string | null,
// ) => {
//   return Prisma.validator<Prisma.ConsumableCreateInput>()({
//     name,
//     count,
//     description,
//     guide,
//     photo,
//   });
// };
export default router;

import express from 'express';
import { NewConsumable, TakeConsumable } from '../common/schema/schema_consumable';
import { ajv } from '../common/validation';
import prisma from '../config/database';
import { createResponse } from '../common/response';
import passport from 'passport';
import { User } from '@prisma/client';

const router = express.Router();

/** Get all consumables */
router.get('/consumables', async function (req, res) {
  const consumables = await prisma.consumable.findMany();
  res.json(createResponse({ data: consumables }));
});

/** Create a consumable */
router.post('/consumables', async function (req, res) {
  try {
    const validator = ajv.getSchema<NewConsumable>('newConsumable');
    const body = req.body;
    if (validator !== undefined && validator(body)) {
      // we can be certain data is safe to use because we used ajv to verify
      const consumable = await prisma.consumable.create({ data: body });
      return res.json(createResponse({ data: consumable }));
    }
    res.json(createResponse({ error: ajv.errorsText(validator?.errors) }));
  } catch (err) {
    log.error(err);
  }
});

/** Delete a consumable */
router.delete('/consumable/:id', async function (req, res) {
  try {
    const { id } = req.params;
    const consumable = await prisma.consumable.delete({
      where: {
        id: id,
      },
    });
    res.json(createResponse({ data: consumable }));
  } catch (err) {
    res.status(400).json(
      createResponse({
        error: 'Item does not exist',
      }),
    );
    log.error(err);
  }
});

/** Get a single specific consumable, show transaction history as well */
router.get('/consumable/:id', async function (req, res) {
  const { id } = req.params;
  const consumable = await prisma.consumable.findUnique({
    where: {
      id: id,
    },
    include: {
      Transaction: true,
    },
  });
  if (consumable === null) {
    return res.status(404).json(createResponse({ error: 'Consumable does not exist' }));
  }
  res.json(createResponse({ data: consumable }));
});

/** Consume a given amount of a single consumable */
router.put('/consumable/:id/take', async function (req, res) {
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
  res.json(createResponse({ data: consumable }));
});

/** Consume a given amount of a single consumable and add into transaction table */
router.put('/consumable/:id/take/track', passport.authenticate('jwt', { session: false }), async function (req, res) {
  try {
    // used to validate json
    const validator = ajv.getSchema<TakeConsumable>('takeConsumable');
    const { id } = req.params;
    const userId = (req.user as User).id; // get requester userid from passport
    if (validator === undefined) {
      return res.status(500).json(createResponse({ error: 'Unable to get validator to parse json' }));
    }
    if (!validator(req.body)) {
      return res.status(401).json(createResponse({ error: ajv.errorsText(validator.errors) }));
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
    const addTransaction = prisma.transaction.create({
      data: {
        consumableId: id,
        userId: userId,
        type: 'CONSUME',
      },
    });
    const [consumeResult, transactionResult] = await prisma.$transaction([takeConsumable, addTransaction]);
    res.json(createResponse({ data: { consumeResult, transactionResult } }));
  } catch (err) {
    log.error(err);
    res.status(401).json(createResponse({ error: 'Unable to take consumable' }));
  }
});

export default router;

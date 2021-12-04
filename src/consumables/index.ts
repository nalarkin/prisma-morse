import express from 'express';
import { NewConsumable } from '../common/schema/schema_consumable';
import { ajv } from '../common/validation';
import prisma from '../config/database';
import { createResponse } from '../common/response';

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

/** Get a single specific consumable */
router.get('/consumable/:id', async function (req, res) {
  const { id } = req.params;
  const consumable = await prisma.consumable.findUnique({
    where: {
      id: id,
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

export default router;

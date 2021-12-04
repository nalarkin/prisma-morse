import express from 'express';
import { NewConsumable } from '../common/schema/schema_consumable';
import { ajv } from '../common/validation';
import prisma from '../config/database';

const router = express.Router();

/** Get all consumables */
router.get('/consumables', async function (req, res) {
  const consumables = await prisma.consumable.findMany();
  res.json(consumables);
});

/** Create a consumable */
router.post('/consumables', async function (req, res, next) {
  try {
    const validator = ajv.getSchema<NewConsumable>('newConsumable');
    const body = req.body;
    if (validator !== undefined && validator(body)) {
      // we can be certain data is safe to use because we used ajv to verify
      const consumable = await prisma.consumable.create({ data: body });
      return res.json(consumable);
    }
    res.json(ajv.errorsText(validator?.errors));
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
    res.json({ success: true, data: consumable, error: {} });
  } catch (err) {
    res.status(400).json({
      success: false,
      data: {},
      error: { message: 'Item does not exist' },
    });
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
  res.json(consumable);
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
  res.json(consumable);
});

export default router;

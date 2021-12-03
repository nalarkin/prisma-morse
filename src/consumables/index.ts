import express from 'express';
import { prisma } from '../app';

const router = express.Router();

router.get('/consumables', async function (req, res) {
  const consumables = await prisma.consumable.findMany();
  res.json(consumables);
});

router.delete('/consumable/:id', async function (req, res) {
  const { id } = req.params;
  const consumable = await prisma.consumable.delete({
    where: {
      id: id,
    },
  });
  res.json(consumable);
});

router.get('/consumable/:id', async function (req, res) {
  const { id } = req.params;
  const consumable = await prisma.consumable.findUnique({
    where: {
      id: id,
    },
  });
  res.json(consumable);
});
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

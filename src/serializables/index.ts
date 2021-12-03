import express from 'express';
import { prisma } from '../index';

const router = express.Router();

router.get('/serializables', async (req, res) => {
  const serializables = await prisma.serializable.findMany();
  res.json(serializables);
});

router.delete('/serializable/:id', async (req, res) => {
  const { id } = req.params;
  const serializable = await prisma.serializable.delete({
    where: {
      id: id,
    },
  });
  res.json(serializable);
});

router.get('/serializable/:id', async (req, res) => {
  const { id } = req.params;
  const serializable = await prisma.serializable.findUnique({
    where: {
      id: id,
    },
  });
  res.json(serializable);
});

router.put('/serializable/:id/checkout', async (req, res) => {
  const { id } = req.params;
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const serializable = await prisma.serializable.update({
    where: {
      id: id,
    },
    data: {
      renterId: 4,
    },
  });
  res.json(serializable);
});
router.put('/serializable/:id/return', async (req, res) => {
  const { id } = req.params;
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const serializable = await prisma.serializable.update({
    where: {
      id: id,
    },
    data: {
      renterId: null,
    },
  });
  res.json(serializable);
});

export default router;

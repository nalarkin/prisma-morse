import express from 'express';
import { createResponse } from '../common/response';
import prisma from '../config/database';

const router = express.Router();

router.get('/serializables', async function (req, res) {
  const serializables = await prisma.serializable.findMany();
  res.json(createResponse({ data: serializables }));
});

router.delete('/serializable/:id', async (req, res) => {
  const { id } = req.params;
  const serializable = await prisma.serializable.delete({
    where: {
      id: id,
    },
  });
  res.json(createResponse({ data: serializable }));
});

router.get('/serializable/:id', async (req, res) => {
  const { id } = req.params;
  const serializable = await prisma.serializable.findUnique({
    where: {
      id: id,
    },
  });
  if (serializable === null) {
    return res
      .status(404)
      .json(createResponse({ error: 'Serializable item does not exist' }));
  }
  res.json(createResponse({ data: serializable }));
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
  res.json(createResponse({ data: serializable }));
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
  res.json(createResponse({ data: serializable }));
});

export default router;

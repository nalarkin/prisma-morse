import { User } from '@prisma/client';
import express from 'express';
import passport from 'passport';
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
    include: {
      User: true,
    },
  });
  if (serializable === null) {
    return res.status(404).json(createResponse({ error: 'Serializable item does not exist' }));
  }
  res.json(createResponse({ data: serializable }));
});
router.get('/serializable/:id/checkout/auth', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;
  const userId = (req.user as User).id;
  // find serializable and checkout
  const serializable = await prisma.serializable.update({
    where: {
      id: id,
    },
    data: {
      userId: userId,
    },
  });
  // update user connection with item
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      Serializable: { connect: { id: id } },
    },
  });
  if (serializable === null) {
    return res.status(404).json(createResponse({ error: 'Serializable item does not exist' }));
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
      userId: 4,
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
      userId: null,
    },
  });
  res.json(createResponse({ data: serializable }));
});

export default router;

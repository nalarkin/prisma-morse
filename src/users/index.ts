import express from 'express';
import prisma from '../config/database';
import { createResponse } from '../common/response';

const router = express.Router();

/** Get all users */
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(createResponse({ data: users }));
});

/** Delete specified user */
router.delete('/:id/', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(createResponse({ data: user }));
});

/** Get the current user info, including the serializables they currently have checked out. */
router.get('/:id/', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      serializables: true,
    },
  });
  if (user === null) {
    return res.status(404).json(createResponse({ error: 'This user does not exist' }));
  }
  res.json(createResponse({ data: user }));
});

export default router;

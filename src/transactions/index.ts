import express from 'express';
import { createResponse } from '../common/response';
import prisma from '../config/database';

const router = express.Router();

router.get('/transactions', async function (req, res) {
  const transactions = await prisma.transaction.findMany({ include: { User: true } });
  res.json(createResponse({ data: transactions }));
});

export default router;

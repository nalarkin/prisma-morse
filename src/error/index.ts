import { Transaction, User } from '@prisma/client';
import express from 'express';
import passport from 'passport';
import { JWTData } from '../auth/utils';
import { createResponse } from '../common/response';
import prisma from '../config/database';
import { logger } from '../config/logging';

const router = express.Router();

async function functionThatThrowsError() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 1000);
    throw new Error('I threw this error');
  });
}

/** Expect it to crash server */
router.get('/error/', async (req, res) => {
  await functionThatThrowsError();
  res.json(createResponse({ data: { message: 'All good no errors' } }));
});
/** Pass to next */
router.get('/error/handled/', async (req, res, next) => {
  try {
    await functionThatThrowsError();
    res.json(createResponse({ data: { message: 'All good no errors' } }));
  } catch (err) {
    next(err);
  }
});

export default router;

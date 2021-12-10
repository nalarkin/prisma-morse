import express from 'express';
import { createResponse } from '@/common';

const router = express.Router();

async function functionThatThrowsError() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 1000);
    throw new Error('I threw this error');
  });
}

/** Expect it to crash server */
router.get('/', async (req, res) => {
  await functionThatThrowsError();
  res.json(createResponse({ data: { message: 'All good no errors' } }));
});

/** Pass to next */
router.get('/handled/', async (req, res, next) => {
  try {
    await functionThatThrowsError();
    res.json(createResponse({ data: { message: 'All good no errors' } }));
    throw '';
  } catch (err) {
    next(err);
  }
});

export default router;

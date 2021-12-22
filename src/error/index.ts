/**
 * Routes that are used for testing how to propery handle errors in Express.
 * These routes will not be used in the production application.
 */

import { Router } from 'express';
import { createResponse } from '@/common';
import createError from 'http-errors';

const router = Router();

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
    return res.json(createResponse({ data: { message: 'All good no errors' } }));
  } catch (err) {
    next(err);
  }
});

router.get('/http-error/', async (req, res, next) => {
  // const e = new createError.Unauthorized('Please login to view this page.');
  // const d = createError(401, 'Please Login');
  // return next(new createError.Unauthorized('Please login to view this page.'));
  try {
    await testThrow();
    return res.send('success');
  } catch (e) {
    next(e);
  }
});

async function testThrow() {
  test2();
}

function test2() {
  throw createError(401, 'Please Login');
}

export default router;

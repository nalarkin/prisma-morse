/**
 * Used for development purposes only. Lists the data representation for data generated for test cases.
 *
 * Changing this file does not affect the way existing or future test cases are handled.
 */

import { Router } from 'express';
// import { schemaSecurity } from '../common';
import { makeTestConsumable, makeTestSerializable, makeTestUser } from './utils';

const router = Router();
const DATA_SAMPLE_SIZE = 5; // change value here to change the quantity of generated sample data

/** Get all test data representations */
router.get('/', async function (req, res, next) {
  try {
    const users = Array.from({ length: DATA_SAMPLE_SIZE }).map(() => makeTestUser());
    const serializables = Array.from({ length: DATA_SAMPLE_SIZE }).map(() => makeTestSerializable());
    const consumables = Array.from({ length: DATA_SAMPLE_SIZE }).map(() => makeTestConsumable());
    return res.send({ users, serializables, consumables });
  } catch (e) {
    next(e);
  }
});

// router.get('/security', async (req, res, next) => {
//   try {
//     return res.json(schemaSecurity);
//   } catch (e) {
//     next(e);
//   }
// });

export default router;

import { Router } from 'express';
import passport from 'passport';
import { getRequireAdminMiddleware } from '../common';
import prisma from '../loaders/database';
import * as consumablesController from './consumablesController';

const router = Router();

/** Require JWT authentication for all requests here */
router.use(passport.authenticate('jwt', { session: false }));

/** Get all consumables */
router.get('/', async function (req, res, next) {
  try {
    return res.json(await prisma.consumable.findMany());
  } catch (e) {
    next(e);
  }
});

/** Create a consumable */
router.post(
  '/',
  getRequireAdminMiddleware('You do not have permission to create consumables'),
  consumablesController.createConsumable,
);

/** Use item id verification for every request that provides an id param */
// router.use('/:id/', verifyCUIDMiddleware);

/**
 * Delete a consumable. Need to decide on deletion tracking method. Cascade delete
 * is necessary? Maybe move it into a new table?
 * @TODO: find way to delete item while retaining history and users
 * */
router.delete(
  '/:id/',
  getRequireAdminMiddleware('You do not have permission to delete items'),
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const deleteAction = prisma.consumable.delete({
        where: {
          id: id,
        },
      });
      const [deleteResult] = await prisma.$transaction([deleteAction]);
      return res.json(deleteResult);
    } catch (err) {
      next(err);
    }
  },
);

/** Get a single specific consumable, show transaction history as well */
router.get('/:id/', consumablesController.getConsumable);
/** Update a single specific consumable */
router.put('/:id/', consumablesController.updateConsumable);

/** Consume a given amount of a single consumable and add into transaction table */
router.put('/:id/take/', consumablesController.takeConsumable);

export default router;

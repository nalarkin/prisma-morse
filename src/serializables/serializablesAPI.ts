/**
 * Exposes the API Endpoints to perform CRUD operations on serializables in the database.
 *
 * To add the API route handlers to the express app, call the router.use() command and
 * provide the exported router from this module.
 */
import { Router } from 'express';
import passport from 'passport';
import { getRequireAdminMiddleware, verifyCUIDMiddleware } from '../common';
import * as serializablesController from './serializablesController';

const router = Router();

router.get('/verify/:id/', verifyCUIDMiddleware); // used for debugging purposes

// Require every route handler here to be from authenticated source (must have valid JWT token)
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', serializablesController.getAll);

/** Create a serializable */
router.post('/', getRequireAdminMiddleware(), serializablesController.createItem);

/** Delete serializable if user is Admin */
router.delete('/:id/', getRequireAdminMiddleware(), serializablesController.deleteItem);

router.get('/:id/', serializablesController.getSingle);

router.put(
  '/:id/',
  getRequireAdminMiddleware('You must be an admin to edit items'),
  serializablesController.updateItem,
);

/**
 * Checkout Serializable
 * Solve issue of double checking by using the following recommendation
 * https://bit.ly/3pjbG40
 */
router.put('/:id/checkout/', serializablesController.checkout);

/** Return an item, only if the person returning matches the current renter  */
router.put('/:id/return/', serializablesController.returnItem);

export default router;

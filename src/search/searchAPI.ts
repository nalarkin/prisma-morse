/**
 * Exposes the API Endpoints to perform CRUD operations on serializables in the database.
 *
 * To add the API route handlers to the express app, call the router.use() command and
 * provide the exported router from this module.
 */
import { Router } from 'express';
import passport from 'passport';
import * as searchController from './searchController';

const router = Router();

// Require every route handler here to be from authenticated source (must have valid JWT token)
router.use(passport.authenticate('jwt', { session: false }));

router.get('/', searchController.searchBasic);

export default router;

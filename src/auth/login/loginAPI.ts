/**
 * API Endpoints for user initial login authentication.
 */

import { Router } from 'express';
import * as loginController from './loginController';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get('/', async (req, res, next) => {
  return res.send('hello world');
});

/**
 * @openapi
 * /:
 *   post:
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    parameters:
 *    - in: "body"
 *      name: "body"
 *      description: "The user login credentials"
 *      required: true
 *      schema:
 *        type: "object"
 *        properties:
 *          email:
 *            type: "string"
 *            format: "email"
 *          password:
 *            type: "string"
 *
 *    responses:
 *      200:
 *        description: Successful login
 *        schema:
 *          type: "object"
 *      401:
 *        description: Invalid Login Credentials
 */
router.post('/', loginController.login);

export default router;

/**
 * Login user, and return with JWT if successful.
 * Will return an access_token with shorter lifetime, and a refresh_token with longer lifetime.
 */

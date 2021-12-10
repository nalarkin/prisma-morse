import express from 'express';
import passport from 'passport';
import { createResponse } from '../../common/response';
import { JWTData } from '../utils';

const router = express.Router();

/** Route that all registered users can see */
router.get('/protected/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(
    createResponse({
      data: {
        msg: 'You are successfully authenticated to this route!',
        user: req.user,
      },
    }),
  );
});

/** Route that only admins can see. */
router.get('/admin/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // casting [req.user] for autocomplete
  const { role } = req.user as JWTData;
  if (role === 'USER') {
    // not authorized
    return res.status(401).json(createResponse({ error: 'You do not have sufficient permissions.', status: 401 }));
  }
  // only admins will be able to see below content
  res.status(200).json(
    createResponse({
      data: {
        message: 'You are successfully authenticated to this route!',
        user: req.user,
      },
    }),
  );
});
export default router;

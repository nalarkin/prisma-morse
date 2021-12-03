import express from 'express';
import { verifyPassword } from '../utils';
import passport from 'passport';

const router = express.Router();

router.get(
  '/auth/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
      user: req.user,
    });
  }
);
export default router;

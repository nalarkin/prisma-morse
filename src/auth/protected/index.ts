import { Router } from 'express';
import passport from 'passport';
import { getRequireAdminMiddleware } from '@/common';

const router = Router();

/** Route that all registered users can see */
router.get('/protected/', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({
    msg: 'You are successfully authenticated to this route!',
    user: req.user,
  });
});

/** Route that only admins can see. */
router.get('/admin/', passport.authenticate('jwt', { session: false }), getRequireAdminMiddleware(), (req, res) => {
  // only admins will be able to see below content
  return res.json({
    message: 'You are successfully authenticated to this route!',
    user: req.user,
  });
});

export default router;

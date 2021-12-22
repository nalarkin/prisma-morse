import { Router } from 'express';
import dayjs from 'dayjs';
import { logger } from '@/loaders/logging';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    logger.info(JSON.stringify(req.cookies));
    const dataToSecure = {
      dataToSecure: 'This is the secret data in the cookie.',
    };

    res.cookie('secureCookie', JSON.stringify(dataToSecure), {
      secure: process.env.NODE_ENV !== 'development',
      // secure: true,
      httpOnly: true,
      expires: dayjs().add(20, 'minutes').toDate(),
    });

    res.send('Hello.');
  } catch (e) {
    next(e);
  }
});
router.get('/t/', async (req, res, next) => {
  try {
    logger.info(JSON.stringify(req.cookies));
    const dataToSecure = {
      dataToSecure: 'This is the secret data in the cookie.',
    };

    res.cookie('refresh_token', JSON.stringify(dataToSecure), {
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      expires: dayjs().add(15, 'seconds').toDate(),
      path: '/auth/token/refresh/',
    });

    res.send('Hello.');
  } catch (e) {
    next(e);
  }
});

export default router;

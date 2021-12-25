/**
 * This is only used during development, it will list all routes available to the user
 * It is simply for convenience, will not be pushed to production.
 */

import { Router } from 'express';
import listEndpoints from 'express-list-endpoints';
import { app } from '@/loaders';

const router = Router();

/** Create clickable links to all methods that accept GET requests  */
router.get('/', async (req, res, next) => {
  try {
    res.send(buildHTML());
  } catch (e) {
    next(e);
  }
});

/** Show all routes, including their middlewares and valid methods. */
router.get('/json/', async (req, res, next) => {
  try {
    res.send(listEndpoints(app));
  } catch (e) {
    next(e);
  }
});

/** Convert the endpoints into unsafe html for only development purposes */
function buildHTML() {
  const endpoints = listEndpoints(app);
  const arr = endpoints.map((val) => buildLink(val.path, val.methods));
  return `<!DOCTYPE html><html lang="en">${arr.join('')}</html>`;
}
const PORT = process.env.PORT || 8000;
function buildLink(href: string, methods: string[]) {
  if (!methods.includes('GET')) {
    return '';
  }
  const uri = `http://localhost:${PORT}${href}`;
  return `<a href="${uri}">${uri}</a><br>`;
}

export default router;

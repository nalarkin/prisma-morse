/**
 * This is only used during development, it will list all routes available to the user
 * It is simply for convenience.
 */

import { Router } from 'express';
import listEndpoints from 'express-list-endpoints';
import { app } from '@/loaders';

const route = Router();

export function devAPI(appRouter: Router) {
  appRouter.use('/', route);

  route.get('/', async (req, res, next) => {
    try {
      res.send(buildHTML());
    } catch (e) {
      next(e);
    }
  });
  route.get('/json/', async (req, res, next) => {
    try {
      res.send(listEndpoints(app));
    } catch (e) {
      next(e);
    }
  });
  function buildHTML() {
    const endpoints = listEndpoints(app);
    const arr = endpoints.map((val) => buildLink(val.path, val.methods));
    const doc = `<!DOCTYPE html><html lang="en">${arr.join('')}</html>`;
    return doc;
  }
  const PORT = process.env.PORT || 8000;
  function buildLink(href: string, methods: string[]) {
    if (!methods.includes('GET')) {
      return '';
    }
    // const methodHTML = `${methods.join(' ')}`;
    const uri = `http://localhost:${PORT}${href}`;
    return `<a href="${uri}">${uri}</a><br>`;
  }
}

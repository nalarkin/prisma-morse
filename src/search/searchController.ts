import type { RequestHandler } from 'express';
// import createError from 'http-errors';
import { getValidated, SCHEMA } from '../common';
// import type { SerializableJson } from '../common/schema';
// import { SerializableNew } from '../common/schema/serializable';
// import * as searchService from './searchService';
import { SearchBasic } from '../common/schema/search';
import { performSearchBasic } from './searchService';

/** Get all serializables */
export const searchBasic: RequestHandler = async (req, res, next) => {
  try {
    const validated = getValidated<SearchBasic>(SCHEMA.SEARCH_BASIC, req.query);
    return res.json(await performSearchBasic(validated));
  } catch (e) {
    next(e);
  }
};

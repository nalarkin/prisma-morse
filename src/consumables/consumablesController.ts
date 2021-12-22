import { JWTData } from '@/auth/utils';
import { ajv, NewConsumable, SCHEMA, TakeConsumable } from '@/common';
import { RequestHandler } from 'express';
import * as consumableService from './consumableService';
import createError from 'http-errors';
export const getConsumable: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    return res.json(await consumableService.getConsumable(id));
  } catch (e) {
    next(e);
  }
};

export const takeConsumable: RequestHandler = async (req, res, next) => {
  try {
    const validator = ajv.getSchema<TakeConsumable>(SCHEMA.CONSUMABLE_TAKE);
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData; // get requester userid from passport
    const { body } = req;
    if (validator === undefined) {
      throw createError(500, 'Unable to get validator to parse json');
    }
    if (!validator(body)) {
      throw createError(400, ajv.errorsText(validator.errors));
    }
    const { count } = body;
    return res.json(await consumableService.takeConsumable(id, userId, count));
  } catch (e) {
    next(e);
  }
};

export const createConsumable: RequestHandler = async (req, res, next) => {
  try {
    const validator = ajv.getSchema<NewConsumable>(SCHEMA.CONSUMABLE_NEW);
    const body = req.body;
    const { sub: userId } = req.user as JWTData;

    if (validator === undefined) {
      throw createError(500, 'Unable to get json validator');
    }
    if (!validator(body)) {
      throw createError(400, ajv.errorsText(validator.errors));
    }
    return res.json(await consumableService.createConsumable(body, userId));
  } catch (e) {
    next(e);
  }
};

import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { ConsumableJson, getValidator, NewConsumable, TakeConsumable } from '../common';
import { ajv, getValidJWTPayload, SCHEMA } from '../common';
import { getValidCUID } from '../common/customMiddlewares';
import * as consumableService from './consumableService';
export const getConsumable: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    return res.json(await consumableService.getConsumable(id));
  } catch (e) {
    next(e);
  }
};

export const takeConsumable: RequestHandler = async ({ params, user, body }, res, next) => {
  try {
    const id = getValidCUID(params.id);
    const { sub: userId } = getValidJWTPayload(user); // get requester userid from passport
    const { count } = getValidConsumableCount(body);
    return res.json(await consumableService.takeConsumable(id, userId, count));
  } catch (e) {
    next(e);
  }
};

function getValidConsumableCount(body: unknown): TakeConsumable {
  const validator = getValidator<TakeConsumable>(SCHEMA.CONSUMABLE_TAKE);
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

export const createConsumable: RequestHandler = async ({ user, body }, res, next) => {
  try {
    const { sub: userId } = getValidJWTPayload(user);
    return res.json(await consumableService.createConsumable(getValidCreateForm(body), userId));
  } catch (e) {
    next(e);
  }
};

function getValidCreateForm(body: unknown) {
  const validator = getValidator<NewConsumable>(SCHEMA.CONSUMABLE_NEW);
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

/** Ensure that a complete item is provided for the update */
function getValidUpdateForm(id: string, body: unknown): ConsumableJson {
  const validator = getValidator<ConsumableJson>(SCHEMA.CONSUMABLE_UPDATE);
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  if (id !== body.id) {
    throw createError(400, 'ID in URI must match the ID in HTTP request');
  }
  return body;
}

/** Update serializable if user is admin */
export const updateConsumable: RequestHandler = async ({ params, body }, res, next) => {
  try {
    const id = getValidCUID(params.id);
    // @TODO: Add error handling when deleting item
    return res.json(await consumableService.updateConsumable(getValidUpdateForm(id, body)));
  } catch (err) {
    next(err);
  }
};

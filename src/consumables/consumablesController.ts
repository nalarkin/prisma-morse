import type { RequestHandler } from 'express';
import createError from 'http-errors';
import type { ConsumableJson, NewConsumable, TakeConsumable } from '../common';
import { getValidated, getValidJWTPayload, SCHEMA } from '../common';
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
  return getValidated<TakeConsumable>(SCHEMA.CONSUMABLE_TAKE, body);
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
  return getValidated<NewConsumable>(SCHEMA.CONSUMABLE_NEW, body);
}

/** Ensure that a complete item is provided for the update */
function getValidUpdateForm(id: string, body: unknown): ConsumableJson {
  const data = getValidated<ConsumableJson>(SCHEMA.CONSUMABLE_UPDATE, body);

  if (id !== data.id) {
    throw createError(400, 'ID in URI must match the ID in HTTP request');
  }
  return data;
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

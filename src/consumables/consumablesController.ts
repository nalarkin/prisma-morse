import { ajv, ConsumableJson, NewConsumable, SCHEMA, TakeConsumable, validateJWTFormat } from '@/common';
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
    const { id } = req.params;
    const { sub: userId } = validateJWTFormat(req.user); // get requester userid from passport
    const { count } = validateTakeConsumable(req.body);
    return res.json(await consumableService.takeConsumable(id, userId, count));
  } catch (e) {
    next(e);
  }
};

function validateTakeConsumable(body: unknown): TakeConsumable {
  const validator = ajv.getSchema<TakeConsumable>(SCHEMA.CONSUMABLE_TAKE);
  if (validator === undefined) {
    throw createError(500, 'Unable to get validator to parse json');
  }
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

export const createConsumable: RequestHandler = async (req, res, next) => {
  try {
    const { sub: userId } = validateJWTFormat(req.user);
    const body = validateCreateConsumable(req.body);
    return res.json(await consumableService.createConsumable(body, userId));
  } catch (e) {
    next(e);
  }
};

function validateCreateConsumable(body: unknown) {
  const validator = ajv.getSchema<NewConsumable>(SCHEMA.CONSUMABLE_NEW);
  if (validator === undefined) {
    throw createError(500, 'Unable to get json validator');
  }
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}

/** Ensure that a complete item is provided for the update */
function validateUpdateConsumableForm(id: string, body: unknown): ConsumableJson {
  const validator = ajv.getSchema<ConsumableJson>(SCHEMA.CONSUMABLE_UPDATE);
  if (validator === undefined) {
    throw createError(500, 'Unable to get JSON validator');
  }
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  if (id !== body.id) {
    throw createError(400, 'ID in URI must match the ID in HTTP request');
  }
  return body;
}

/** Update serializable if user is admin */
export const updateConsumable: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = validateUpdateConsumableForm(id, req.body);
    // @TODO: Add error handling when deleting item
    return res.json(await consumableService.updateConsumable(body));
  } catch (err) {
    next(err);
  }
};

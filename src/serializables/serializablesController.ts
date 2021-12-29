import type { RequestHandler } from 'express';
import createError from 'http-errors';
import { ajv, getValidCUID, getValidJWTPayload, SCHEMA } from '../common';
import type { SerializableJson } from '../common/schema';
import { SerializableNew } from '../common/schema/schema_serializable';
import * as serializablesService from './serializablesService';

/** Get all serializables */
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await serializablesService.getAll());
  } catch (e) {
    next(e);
  }
};

/** Get detailed information of a single provided serializable*/
export const getSingle: RequestHandler = async ({ params }, res, next) => {
  try {
    return res.json(await serializablesService.getSingleSerializable(getValidCUID(params.id)));
  } catch (err) {
    next(err);
  }
};

/**
 * Checkout Serializable
 * Solve issue of double checking by using the following recommendation
 * https://bit.ly/3pjbG40
 */
export const checkout: RequestHandler = async ({ params, user }, res, next) => {
  try {
    const { sub: userId } = getValidJWTPayload(user);
    return res.json(await serializablesService.checkout(getValidCUID(params.id), userId));
  } catch (err) {
    next(err);
  }
};

export const returnItem: RequestHandler = async ({ params, user }, res, next) => {
  try {
    const { sub: userId } = getValidJWTPayload(user);
    /** Insert logic to check if request id requesting change is the same as the current renter */
    return res.json(await serializablesService.returnItem(getValidCUID(params.id), userId));
  } catch (err) {
    next(err);
  }
};

export const createItem: RequestHandler = async ({ user, body }, res, next) => {
  try {
    const { sub: userId } = getValidJWTPayload(user);
    return res.json(await serializablesService.createItem(getValidSerializableNewForm(body), userId));
  } catch (err) {
    next(err);
  }
};

/** Delete serializable if user is admin */
export const deleteItem: RequestHandler = async ({ params }, res, next) => {
  try {
    // @TODO: Add error handling when deleting item
    return res.json(await serializablesService.deleteItem(getValidCUID(params.id)));
  } catch (err) {
    next(err);
  }
};
/** Update serializable if user is admin */
export const updateItem: RequestHandler = async ({ params, body }, res, next) => {
  try {
    // @TODO: Add error handling when deleting item
    return res.json(await serializablesService.updateItem(getValidUpdateForm(params.id, body)));
  } catch (err) {
    next(err);
  }
};

function getValidUpdateForm(id: unknown, body: unknown) {
  return validateUpdateForm(getValidCUID(id), body);
}

/** Ensure that a complete item is provided for the update */
function validateUpdateForm(id: string, body: unknown) {
  const validator = getUpdateFormValidator();
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }

  if (id !== body.id) {
    throw createError(400, 'ID in URI must match the ID in HTTP request');
  }
  return body;
}

function getUpdateFormValidator() {
  const validator = ajv.getSchema<SerializableJson>(SCHEMA.SERIALIZABLE_UPDATE);
  if (validator === undefined) {
    throw createError(500, 'Unable to get JSON validator');
  }
  return validator;
}

function getValidSerializableNewForm(body: unknown) {
  const validator = getSerializableNewValidator();
  if (!validator(body)) {
    throw createError(400, ajv.errorsText(validator.errors));
  }
  return body;
}
function getSerializableNewValidator() {
  const validator = ajv.getSchema<SerializableNew>(SCHEMA.SERIALIZABLE_NEW);
  if (validator === undefined) {
    throw createError(500, 'Unable to get JSON validator');
  }
  return validator;
}

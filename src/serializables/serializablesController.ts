import { RequestHandler } from 'express';
import * as serializablesService from './serializablesService';
import { JWTData } from '@/auth/utils';
import { Serializable } from '@prisma/client';
import { ajv, SCHEMA } from '@/common';
import createError from 'http-errors';
import { SerializableJson } from '@/common/schema';

/** Get all serializables */
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    return res.json(await serializablesService.getAll());
  } catch (e) {
    next(e);
  }
};

/** Get detailed information of a single provided serializable*/
export const getSingle: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    return res.json(await serializablesService.getSingle(id));
  } catch (err) {
    next(err);
  }
};

/**
 * Checkout Serializable
 * Solve issue of double checking by using the following recommendation
 * https://bit.ly/3pjbG40
 */
export const checkout: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    return res.json(await serializablesService.checkout(id, userId));
  } catch (err) {
    next(err);
  }
};

export const returnItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    /** Insert logic to check if request id requesting change is the same as the current renter */
    return res.json(await serializablesService.returnItem(id, userId));
  } catch (err) {
    next(err);
  }
};

/** Delete serializable if user is admin */
export const deleteItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    // @TODO: Add error handling when deleting item
    return res.json(await serializablesService.deleteItem(id));
  } catch (err) {
    next(err);
  }
};
/** Update serializable if user is admin */
export const updateItem: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Serializable;
    // @TODO: Add error handling when deleting item
    return res.json(await serializablesService.updateItem(body));
  } catch (err) {
    next(err);
  }
};

/** Ensure that a complete item is provided for the update */
export const validateUpdateItemForm: RequestHandler = async (req, res, next) => {
  try {
    const validator = ajv.getSchema<SerializableJson>(SCHEMA.SERIALIZABLE_UPDATE);
    if (validator === undefined) {
      throw createError(500, 'Unable to get JSON validator');
    }
    const { body } = req;
    if (!validator(body)) {
      throw createError(400, ajv.errorsText(validator.errors));
    }

    const { id } = req.params;
    if (id !== body.id) {
      throw createError(400, 'ID in URI must match the ID in HTTP request');
    }
    next();
  } catch (e) {
    next(e);
  }
};
// export const validateUpdateItemFormType: RequestHandler = async (req, res, next) => {
//   try {
//     const validator = ajv2.getSchema(SCHEMA.SERIALIZABLE_UPDATE);
//     if (validator === undefined) {
//       throw createError(500, 'Unable to get JSON validator');
//     }

//     if (!validator(req.body)) {
//       throw createError(400, ajv.errorsText(validator.errors));
//     }
//     return res.send('success!!');
//   } catch (e) {
//     next(e);
//   }
// };

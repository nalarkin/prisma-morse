import { RequestHandler } from 'express';
import * as serializablesService from './serializablesService';
import { createResponse, ServerError } from '@/common';
import { JWTData } from '@/auth/utils';

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

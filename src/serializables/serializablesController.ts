import { RequestHandler } from 'express';
import { serializablesService } from './serializablesService';
import { createResponse, ForbiddenError, ServerError } from '@/common';
import { JWTData } from '@/auth/utils';

const getAll: RequestHandler = async (req, res, next) => {
  try {
    const serializables = await serializablesService.getAll();
    res.json(createResponse({ data: serializables }));
  } catch (e) {
    next(e);
  }
};

const getSingle: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await serializablesService.getSingle(id);
    if (item instanceof ServerError) {
      return res.status(item.statusCode).json(createResponse({ error: item }));
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const checkout: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    const checkoutResult = await serializablesService.checkout(id, userId);
    if (checkoutResult instanceof ServerError) {
      return res.status(checkoutResult.statusCode).json(createResponse({ error: checkoutResult }));
    }
    return res.json(checkoutResult);
  } catch (err) {
    next(err);
  }
};

const returnItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    /** Insert logic to check if request id requesting change is the same as the current renter */
    const returnResult = await serializablesService.returnItem(id, userId);
    if (returnResult instanceof ServerError) {
      return res.status(returnResult.statusCode).json(createResponse({ error: returnResult }));
    }
    return res.json(returnResult);
  } catch (err) {
    next(err);
  }
};

/** Delete serializable if user is admin */
const deleteItem: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user as JWTData;
    if (role !== 'ADMIN') {
      return res
        .status(403)
        .json(createResponse({ error: new ForbiddenError('You are not authorized to delete serializable items') }));
    }
    // @TODO: Add error handling when deleting item
    const serializable = await serializablesService.deleteItem(id);
    res.json(createResponse({ data: serializable }));
  } catch (err) {
    next(err);
  }
};

export const serializablesController = { getAll, getSingle, checkout, returnItem, deleteItem };

import { Handler } from 'express';
import { serializablesService } from './serializablesService';
import { DoesNotExistError, RentalError, createResponse } from '@/common';
import { JWTData } from '@/auth/utils';

const getAll: Handler = async (req, res, next) => {
  try {
    const serializables = await serializablesService.getAll();
    res.json(createResponse({ data: { serializables } }));
  } catch (e) {
    next(e);
  }
};

const getSingle: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await serializablesService.getSingle(id);
    if (item === null) {
      res.status(404).json(createResponse({ error: 'Item does not exist', status: 404 }));
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const checkout: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    const checkoutResult = await serializablesService.checkout(id, userId);
    if (checkoutResult instanceof DoesNotExistError || checkoutResult instanceof RentalError) {
      return res.status(checkoutResult.statusCode).json(createResponse({ error: checkoutResult.message }));
    }
    return res.json(checkoutResult);
  } catch (err) {
    next(err);
  }
};

const returnItem: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sub: userId } = req.user as JWTData;
    /** Insert logic to check if request id requesting change is the same as the current renter */
    const returnResult = await serializablesService.returnItem(id, userId);
    if (returnResult instanceof DoesNotExistError || returnResult instanceof RentalError) {
      return res.status(returnResult.statusCode).json(createResponse({ error: returnResult.message }));
    }
    return res.json(returnResult);
  } catch (err) {
    next(err);
  }
};

/** Delete serializable if user is admin */
const deleteItem: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user as JWTData;
    if (role !== 'ADMIN') {
      return res
        .status(401)
        .json(createResponse({ error: 'You are not authorized to delete serializable items', status: 401 }));
    }

    const serializable = await serializablesService.deleteItem(id);
    res.json(createResponse({ data: serializable }));
  } catch (err) {
    next(err);
  }
};

export const serializablesController = { getAll, getSingle, checkout, returnItem, deleteItem };

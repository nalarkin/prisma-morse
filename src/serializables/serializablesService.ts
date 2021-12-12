import { serializablesDAL } from './serializablesDAL';
import { DoesNotExistError, RentalError } from '@/common';

async function getAll() {
  return await serializablesDAL.getAll();
}

async function getSingle(id: string) {
  const item = await serializablesDAL.getSingle(id, true);
  if (item === null) {
    return new DoesNotExistError('Item does not exist');
  }
  return item;
}

async function checkout(id: string, userId: number) {
  const availableItem = await serializablesDAL.getSingle(id);

  if (availableItem === null) {
    return new DoesNotExistError('Item does not exist');
  }

  if (availableItem.userId !== null) {
    return new RentalError('Item is already checked out.', 400);
  }

  const serializable = await serializablesDAL.attemptCheckout(id, userId, availableItem.version);
  const transaction = await serializablesDAL.completeCheckoutTransaction(id, userId);
  return { serializable, transaction };
}

async function returnItem(id: string, userId: number) {
  const itemToReturn = await serializablesDAL.getSingle(id);

  if (itemToReturn === null) {
    return new DoesNotExistError('Serializable does not exist');
  }

  if (itemToReturn.userId === null) {
    return new RentalError('You cannot return an item that is not being rented.', 400);
  }

  if (itemToReturn.userId !== userId) {
    return new RentalError('You cannot return an item that someone else is renting.', 401);
  }
  const serializable = await serializablesDAL.returnItem(id, userId);
  return serializable;
}

async function deleteItem(id: string) {
  return await serializablesDAL.deleteItem(id);
}

export const serializablesService = { getAll, getSingle, returnItem, checkout, deleteItem };

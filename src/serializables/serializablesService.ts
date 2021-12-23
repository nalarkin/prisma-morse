import * as serializablesDAL from './serializablesDAL';
import createError from 'http-errors';
import { SerializableJson } from '../common/schema/schema_serializable';

export async function getAll() {
  return serializablesDAL.getAll();
}

export async function getSingle(id: string) {
  const item = await serializablesDAL.getSingle(id, true);
  if (item === null) {
    throw createError(404, 'Item does not exist');
  }
  return item;
}

export async function checkout(id: string, userId: number) {
  const availableItem = await serializablesDAL.getSingle(id);

  if (availableItem === null) {
    throw createError(404, 'Item does not exist');
  }

  if (availableItem.userId !== null) {
    throw createError(400, 'Item is already checked out.');
  }

  const serializable = await serializablesDAL.attemptCheckout(id, userId, availableItem.version);
  const transaction = await serializablesDAL.completeCheckoutTransaction(id, userId);
  return { serializable, transaction };
}

export async function returnItem(id: string, userId: number) {
  const itemToReturn = await serializablesDAL.getSingle(id);

  if (itemToReturn === null) {
    throw createError(404, 'Item does not exist');
  }

  if (itemToReturn.userId === null) {
    throw createError(400, 'You cannot return an item that is not being rented.');
  }

  if (itemToReturn.userId !== userId) {
    throw createError(401, 'You cannot return an item that someone else is renting.');
  }
  return serializablesDAL.returnItem(id, userId);
}

export async function deleteItem(id: string) {
  return serializablesDAL.deleteItem(id);
}

export async function updateItem(serializable: SerializableJson) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, version, ...updatedItem } = serializable; // remove unnecessary properties
  return await serializablesDAL.updateItem(id, updatedItem);
}

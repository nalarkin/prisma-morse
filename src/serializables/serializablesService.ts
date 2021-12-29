import { Serializable } from '@prisma/client';
import createError from 'http-errors';
import type { SerializableJson } from '../common/schema/schema_serializable';
import { SerializableNew } from '../common/schema/schema_serializable';
import * as serializablesDAL from './serializablesDAL';

export async function getAll() {
  return serializablesDAL.getAll();
}

export async function getSingleSerializable(id: string) {
  return getSerializable(id);
}

export async function checkout(id: string, userId: number) {
  const availableItem = await getAvailableSerializable(id, userId);
  const serializable = await serializablesDAL.attemptCheckout(id, userId, availableItem.version);
  const transaction = await serializablesDAL.completeCheckoutTransaction(id, userId);
  return { serializable, transaction };
}

async function getAvailableSerializable(id: string, userId: number) {
  const availableItem = await getSerializable(id);

  if (itemHasRenter(availableItem)) {
    throw createError(400, 'Item is already checked out');
  }
  if (availableItem.userId === userId) {
    throw createError(400, 'You already have this item checked out');
  }
  return availableItem;
}

export async function returnItem(id: string, userId: number) {
  const itemToReturn = await getSerializable(id);

  if (!itemHasRenter(itemToReturn)) {
    throw createError(400, 'You cannot return an item that is not being rented.');
  }

  if (itemToReturn.userId !== userId) {
    throw createError(401, 'You cannot return an item that someone else is renting.');
  }
  return serializablesDAL.returnItem(id, userId);
}

function itemHasRenter({ userId }: Serializable) {
  return userId !== null;
}

async function getSerializable(id: string) {
  const availableItem = await serializablesDAL.getSingle(id);

  if (availableItem === null) {
    throw createError(404, 'Item does not exist');
  }
  return availableItem;
}

export async function deleteItem(id: string) {
  const item = await serializablesDAL.getSingle(id);
  if (item === null) {
    throw createError(404, 'Item does not exist');
  }
  return serializablesDAL.deleteItem(id);
}

export async function updateItem(serializable: SerializableJson) {
  const { id, item } = serializableWithoutProtectedValues(serializable); // remove unnecessary properties
  return serializablesDAL.updateItem(id, item);
}
export async function createItem(serializable: SerializableNew, userId: number) {
  return serializablesDAL.createItem(serializable, userId);
}

function serializableWithoutProtectedValues(serializable: SerializableJson) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, version, renter, ...item } = serializable;
  return { id, item };
}

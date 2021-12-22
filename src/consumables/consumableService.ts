import * as consumableDAL from './consumablesDAL';
import createError from 'http-errors';
import { NewConsumable } from '@/common';

export async function getConsumable(id: string) {
  const consumable = await consumableDAL.getConsumable(id);
  if (consumable === null) {
    throw createError(404, 'Item does not exist');
  }
  return consumable;
}

export async function takeConsumable(id: string, userId: number, amount: number) {
  const [consumableResult] = await consumableDAL.takeConsumable(id, userId, amount);
  return consumableResult;
}

export async function createConsumable(consumable: NewConsumable, userId: number) {
  return consumableDAL.createConsumable(consumable, userId);
}

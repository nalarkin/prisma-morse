import { Prisma } from '@prisma/client';
import prisma from '@/loaders/database';
import type { Transaction } from '@prisma/client';
import type { ConsumableUpdate, NewConsumable } from '@/common';

export async function getConsumable(id: string, includeTransactions = true) {
  return prisma.consumable.findUnique({
    where: {
      id: id,
    },
    include: {
      transactions: includeTransactions,
    },
  });
}

export async function getAllConsumables() {
  return prisma.consumable.findMany();
}

export async function createConsumable(consumable: NewConsumable, userId: number) {
  return prisma.consumable.create({
    data: Prisma.validator<Prisma.ConsumableCreateInput>()({
      ...consumable,
      transactions: {
        create: {
          type: 'CREATE',
          userId,
        },
      },
    }),
  });
}

/** Take a given amount of consumables and create an add the action into the transaction history */
export async function takeConsumable(id: string, userId: number, amount: number) {
  const consumableAction = prisma.consumable.update({
    where: {
      id: id,
    },
    data: {
      count: {
        decrement: amount,
      },
    },
  });
  const addTransaction = createTransaction(id, userId, 'CONSUME');
  // if one fails, both do not get completed.
  return prisma.$transaction([consumableAction, addTransaction]);
}

export async function updateConsuamble(id: string, consumable: ConsumableUpdate) {
  return prisma.consumable.update({ where: { id }, data: { ...consumable } });
}

/** Helper function to create a transaction */
function createTransaction(consumableId: string, userId: number, type: Transaction['type']) {
  return prisma.transaction.create({
    data: {
      consumableId,
      userId,
      type,
    },
  });
}

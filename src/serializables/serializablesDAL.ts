import { Transaction } from '@prisma/client';
import prisma from '@/loaders/database';
export async function getAll() {
  return await prisma.serializable.findMany();
}

export async function getSingle(id: string, includeRenter = true) {
  return await prisma.serializable.findUnique({
    where: {
      id: id,
      // id: id,
    },
    include: {
      renter: includeRenter,
    },
  });
}

export async function deleteItem(id: string) {
  return await prisma.serializable.delete({
    where: {
      id: id,
    },
  });
}

// export async findAvailableItem(id: string) {
//   const serializable = await prisma.serializable.findFirst({
//     where: {
//       id,
//       userId: null,
//     },
//   });
// }

export async function attemptCheckout(id: string, userId: number, version: number) {
  // uses version matcher to gaurantee that another renter hasn't checked out the item during the data race
  const checkoutAction = await prisma.serializable.updateMany({
    data: {
      userId,
      version: {
        increment: 1,
      },
    },
    where: {
      id,
      version, //  only claim seat if in-memory version matches database version, indicating that the field has not been updated
    },
  });

  if (checkoutAction.count === 0) {
    throw new Error(`This item was already checked out. Please try again.`);
  }
  // record the successful transaciton
  return checkoutAction;
}

export async function completeCheckoutTransaction(id: string, userId: number) {
  return await createTransaction(id, userId, 'CHECKOUT');
}

export async function returnItem(id: string, userId: number) {
  /** Insert logic to check if request id requesting change is the same as the current renter */
  const updateAction = prisma.serializable.update({
    where: {
      id,
    },
    data: {
      userId: null,
    },
  });
  const recordAction = createTransaction(id, userId, 'RETURN');
  const [actionResult] = await prisma.$transaction([updateAction, recordAction]);
  return actionResult;
}

/** Helper function to create a transaction */
function createTransaction(serializableId: string, userId: number, type: Transaction['type']) {
  return prisma.transaction.create({
    data: {
      serializableId,
      userId,
      type,
    },
  });
}

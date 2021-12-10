import { SerializablesDAL } from './serializablesDAL';
import { createResponse } from '@/common/response';

export class SerializablesService {
  prismaDb: SerializablesDAL;
  constructor() {
    this.prismaDb = new SerializablesDAL();
  }
  async getAll() {
    return await this.prismaDb.getAll();
  }

  async getSingle(id: string) {
    return await this.prismaDb.getSingle(id, true);
  }

  async checkout(id: string, userId: number) {
    const availableItem = await this.prismaDb.getSingle(id);

    if (availableItem === null) {
      return createResponse({ error: 'Item does not exist', status: 400 });
    }

    if (availableItem.userId !== null) {
      return createResponse({ error: 'Item is already checked out', status: 400 });
    }

    const serializable = await this.prismaDb.attemptCheckout(id, userId, availableItem.version);
    const transaction = await this.prismaDb.completeCheckoutTransaction(id, userId);
    return createResponse({ data: { serializable, transaction } });
  }

  async returnItem(id: string, userId: number) {
    const itemToReturn = await this.prismaDb.getSingle(id);

    if (itemToReturn === null) {
      return createResponse({ error: 'Item does not exist', status: 400 });
    }

    if (itemToReturn.userId === null) {
      return createResponse({ error: 'You cannot return an item that is not being rented', status: 400 });
    }

    if (itemToReturn.userId !== userId) {
      return createResponse({ error: 'You cannot return an item that someone else is renting', status: 401 });
    }

    const returnedItem = await this.prismaDb.returnItem(id, userId);
    return createResponse({ data: returnedItem });
  }
}

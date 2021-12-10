import { SerializablesService } from './serializablesService';
import { createResponse } from '@/common/response';

export interface SerializableControllerContext {
  id?: string;
  userId?: number;
}

export class SerializablesController {
  service: SerializablesService;
  constructor() {
    this.service = new SerializablesService();
  }
  async getAll() {
    return { serializables: await this.service.getAll() };
  }

  async getSingle(id: string) {
    const result = await this.service.getSingle(id);
    if (result === null) {
      return createResponse({ error: 'Item does not exist', status: 404 });
    }
    return createResponse({ data: result });
  }

  async checkout(id: string, userId: number) {
    return await this.service.checkout(id, userId);
  }

  async returnItem(id: string, userId: number) {
    return await this.service.returnItem(id, userId);
  }
}

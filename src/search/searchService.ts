import { SearchBasic } from '../common/schema/search';
import * as searchDAL from './searchDAL';
export async function performSearchBasic({ searchString }: SearchBasic) {
  return {
    serializables: await searchDAL.searchSerializables(searchString),
    consumables: await searchDAL.searchConsumables(searchString),
  };
}
